const {Storage} = require("@google-cloud/storage");//({keyFilename: "helpiyo-app-31115ba877f0.json"});
const moment = require('moment');
const logger = require('../utils/logger');
const Profile = require('../models/profile');

module.exports = function (userId, imagePath) {
    logger.info("uploading profile pic : " + userId);
    const storage = new Storage({keyFilename: "helpiyo-app-31115ba877f0.json"});
    let uploaderBucket = storage.bucket('helpiyo-app-default');
    const file = uploaderBucket.file(`Profile/${userId}/${imagePath}`);

    return Profile.findByIdAndUpdate(userId, {
        profilePic: 'https://firebasestorage.googleapis.com/v0/b/helpiyo-app-public/o/public%2Fblank-profile-pic.png?alt=media&token=68faf9c9-3544-408e-aee9-3e833363ed2a',
        modifiedOn: moment().utc().toDate(),
        imageRefreshedOn: moment().utc().toDate()
    }).exec()
        .then(() => {
            logger.info("getting image : " + imagePath);
            const options = {
                prefix: "Profile/" + userId + "/",
                delimiter: "/"
            };
            return storage.bucket("helpiyo-app-public").getFiles(options)
                .catch(error => {
                    logger.error(error);
                    throw error;
                });
        })
        .then(data => {
            logger.info("moving file");
            let files = data[0];
            let promises = files.map(file => {
                let timestamp = Date.now();
                return file.move(`gs://helpiyo-app-public/Profile/${userId}/deleted/${timestamp}-${file.name}`)
                    .catch(error => {
                        logger.error("couldn't move file :" + file.name);
                        logger.error(error);
                    });
            });
            promises.push(file.move(`gs://helpiyo-app-public/Profile/${userId}/${imagePath}`));
            return Promise.all(promises);
        })
        .then(() => {
            logger.info("getting signed url");
            const config = {
                action: 'read',
                expires: '03-17-2095'
            };
            return storage.bucket("helpiyo-app-public")
                .file(`Profile/${userId}/${imagePath}`)
                .getSignedUrl(config)
                .then(data => {
                    return data[0];
                });
        })
        .then((profilePicUrl) => {
            logger.info("updating database");
            return Profile.findByIdAndUpdate(userId, {
                profilePic: profilePicUrl,
                modifiedOn: moment().utc().toDate(),
                imageRefreshedOn: moment().utc().toDate()
            }).exec();
        })
        .then(() => {
            logger.info("image uploaded successfully");
            return {code: 200, uploaded: true};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};