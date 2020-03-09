const {Storage} = require("@google-cloud/storage");//({keyFilename: "helpiyo-app-31115ba877f0.json"});
const logger = require('../utils/logger');
const os = require('os');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const sharp = require('sharp');

module.exports = (userId, elementId, imagePaths, elementType) => {
    logger.info("copying images to bucket : " + elementId + " by : " + userId + " : " + elementType);

    if (userId === elementId) {
        elementId = "Profile/" + elementId;
    }
    const storage = new Storage({keyFilename: "helpiyo-app-31115ba877f0.json"});
    let uploaderBucket = storage.bucket('helpiyo-app-default');

    let promises = imagePaths.map(imagePath => {
        const file = uploaderBucket.file(`Profile/${userId}/${elementType}/${elementId}/${imagePath}`);
        const tempPath = path.join(os.tmpdir(), userId + "_" + elementId + "_" + imagePath);
        const tempOutPath = path.join(os.tmpdir(), userId + "_" + elementId + "_thumb_" + imagePath);

        logger.info("copying image : " + imagePath);
        const currentFile = storage.bucket("helpiyo-app-public")
            .file(`${elementType}/${elementId}/${imagePath}`);
        return Promise.resolve()
            .then(() => {
                return currentFile.exists()
                    .catch(error => {
                        logger.info("current file not found");
                        logger.info(error);
                        return false;
                    });
            })
            .then(data => {
                const exists = data[0];
                if (exists) {
                    logger.info("current file found");
                    let timestamp = moment().utc().toDate().getTime();
                    let thumbFile = storage.bucket("helpiyo-app-public").file(`${elementType}/${elementId}/thumbnails/${imagePath}`);

                    return currentFile.move(`gs://helpiyo-app-public/${elementType}/${elementId}/deleted/${timestamp + "-" + imagePath}`)
                        .then(() => {
                            return thumbFile.exists()
                                .catch(error => {
                                    logger.info("current thumbnail file not found");
                                    logger.info(error);
                                    return false;
                                });
                        })
                        .then(data => {
                            const exists = data[0];
                            if (exists) {
                                logger.info("thumbnail found");
                                return thumbFile.move(`gs://helpiyo-app-public/${elementType}/${elementId}/thumbnails/deleted/${timestamp + "-" + imagePath}`);
                            }
                            return Promise.resolve();
                        });
                }
                logger.info("current file not found");
                return Promise.resolve();
            })
            .then(() => {
                return file.copy(`gs://helpiyo-app-public/${elementType}/${elementId}/${imagePath}`);
            })
            .then(() => {
                return file.delete();
            })
            .then(() => {
                logger.info("image deleted : " + imagePath);
                logger.info("generating thumbnail");
                return storage.bucket("helpiyo-app-public")
                    .file(`${elementType}/${elementId}/${imagePath}`)
                    .download({destination: tempPath});
            })
            .then(() => {
                return sharp(tempPath).resize(640, 640, {
                    fit: "cover",
                    background: {r: 255, g: 255, b: 255}
                }).toFile(tempOutPath);
            })
            .then(() => {
                logger.info("thumbnail generated : " + tempOutPath);
                return storage.bucket("helpiyo-app-public")
                    .upload(tempOutPath, {destination: `${elementType}/${elementId}/thumbnails/${imagePath}`});
            })
            .then(() => {
                logger.info("thumbnail uploaded : " + tempPath);
                return Promise.all([fs.unlinkSync(tempPath), fs.unlinkSync(tempOutPath)])
                    .catch(error => {
                        logger.error(error);
                    });
            })
            .then(() => {
                logger.info("deleted temp files : " + tempPath);
            });
    });
    return Promise.all(promises)
        .catch(error => {
            logger.error(error);
            throw error;
        })
        .then(() => {
            logger.info("images copied");
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
