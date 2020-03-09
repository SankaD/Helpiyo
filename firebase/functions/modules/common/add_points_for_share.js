const logger = require('../utils/logger');
const addPoints = require('../utils/add_points');
const Points = require('../models/point');

module.exports = (userId, profileId, elementType, elementId) => {
    logger.info("add points for share : " + userId + " : " + profileId + " :" + elementType + " : " + elementId);

    let combinedString = userId + "/" + elementType + "/" + elementId;
    return Points.findOne({
        type: "social-share",
        profileId: profileId,
        target: combinedString,
    }).exec()
        .then(result => {
            if (result) {
                logger.info("already share has been added to the points");
                return Promise.resolve();
            }
            return addPoints(userId, "social-share", combinedString);
        })
        .then(() => {
            logger.info("points for share added");
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