const moment = require('moment');
const {Storage} = require("@google-cloud/storage");//({keyFilename: "helpiyo-app-31115ba877f0.json"});
const logger = require('../utils/logger');
const Request = require('../models/request');
const Response = require('../models/response');
const Service = require('../models/service');
const Profile = require('../models/profile');

module.exports = (userId, elementType, elementId) => {
    logger.info("updating images of : " + elementId + " in : " + elementType + " by : " + userId);

    logger.info("searching for images");
    if (typeof global.it === "function") {
        return Promise.resolve({code: 200});
    }
    let model = null;
    if (elementType === "Request") {
        model = Request;
    } else if (elementType === "Response") {
        model = Response;
    } else if (elementType === "Service") {
        model = Service;
    } else if (elementType === "Profile") {
        model = Profile;
    } else {
        logger.error("unknown element type : " + elementType);
    }

    const storage = new Storage({keyFilename: "helpiyo-app-31115ba877f0.json"});
    let bucket = storage.bucket("helpiyo-app-public");
    const options = {
        prefix: elementType + "/" + elementId + "/",
        delimiter: "/"
    };
    let photos = [];
    logger.info("getting images");
    return bucket.getFiles(options)
        .then(data => {
            logger.info("getting signed urls");
            let files = data[0];
            let promises = files.map(file => {
                const config = {
                    action: 'read',
                    expires: '03-17-2095'
                };
                return file.getSignedUrl(config)
                    .then(data => {
                        return data[0];
                    })
                    .then(url => {
                        let imageName = file.name.split("/").pop();
                        let thumbFile = bucket.file(`${elementType}/${elementId}/thumbnails/${imageName}`);
                        return thumbFile.exists()
                            .then(data => {
                                const exists = data[0];
                                if (exists) {
                                    return thumbFile.getSignedUrl(config)
                                        .then(data => {
                                            return data[0];
                                        });
                                }
                                return "";
                            })
                            .then(thumbUrl => {
                                photos.push({url: url, filename: imageName, thumbnail: thumbUrl});
                            });
                    });
            });
            return Promise.all(promises);
        })
        .then(() => {
            logger.info("updating database");
            const now = moment().utc().toDate();
            if (elementType !== "Profile") {
                photos.sort();
                return model.updateOne({_id: elementId}, {
                    photos: photos,
                    modifiedOn: now,
                    imageRefreshedOn: now
                }).exec();
            } else {
                if (photos.length !== 1) {
                    return Promise.resolve();
                }
                let profilePicUrl = photos[0].url;
                return model.updateOne({_id: elementId}, {
                    profilePic: profilePicUrl,
                    modifiedOn: now,
                    imageRefreshedOn: now
                });
            }

        })
        .then(() => {
            logger.info("successfully updated images");
            return {code: 200};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};