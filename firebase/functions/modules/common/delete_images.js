const {Storage} = require("@google-cloud/storage");//({keyFilename: "helpiyo-app-31115ba877f0.json"});
const logger = require('../utils/logger');
const moment = require('moment');

module.exports = (userId, elementId, imagePaths, elementType) => {
    logger.info("deleting images to bucket : " + elementId + " by : " + userId + " : " + elementType);
    logger.info(arguments);

    const storage = new Storage({keyFilename: "helpiyo-app-31115ba877f0.json"});
    let bucket = storage.bucket('helpiyo-app-public');
    let timestamp = moment().utc().toDate().getTime();
    let promises = imagePaths.map(imagePath => {
        let file = bucket.file(`${elementType}/${elementId}/${imagePath.filename}`);
        return file.exists()
            .catch(error => {
                logger.error(error);
                return [false];
            })
            .then(data => {
                if (data[0]) {
                    return file.move(`${elementType}/${elementId}/deleted/${timestamp + "-" + imagePath.filename}`);
                }
                return Promise.resolve();
            })
            .then(() => {
                logger.info("image deleted : " + imagePath.filename);
                let thumbFile = bucket.file(`${elementType}/${elementId}/thumbnails/${imagePath.filename}`);
                return thumbFile.exists()
                    .catch(error => {
                        logger.error(error);
                        return [false];
                    })
                    .then(data => {
                        if (data[0]) {
                            return thumbFile.move(`${elementType}/${elementId}/thumbnails/deleted/${timestamp + "-" + imagePath.filename}`);
                        }
                        return Promise.resolve();
                    });
            })
            .then(() => {
                logger.info("thumbnail deleted : " + imagePath.filename);
            });
    });
    return Promise.all(promises)
        .catch(error => {
            logger.error(error);
            throw error;
        })
        .then(() => {
            logger.info("images deleted");
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
