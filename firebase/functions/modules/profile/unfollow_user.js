const logger = require('../utils/logger');
const following = require('../models/follows');
const addPoints = require('../utils/add_points');
const checkPoints = require('../utils/check_points');

module.exports = function (currentProfileId, profileId) {
    logger.info("unfollow user");
    logger.info(arguments);
    if (currentProfileId === profileId) {
        logger.warn("current user cannot unfollow himself");
        return Promise.reject("cannot-unfollow-himself");
    }

    return checkPoints(currentProfileId, "unfollow-user")
        .then(() => {
            return following.findOne({from: currentProfileId, to: profileId, deleted: false}).exec();
        })
        .then(edge => {
            if (!edge) {
                throw "user-not-following";
            }
            return edge.updateOne({deleted: true}).exec();
        })
        .then(() => {
            return addPoints(currentProfileId, "unfollow-user", profileId);
        })
        .then(() => {
            return addPoints(profileId, "being-unfollowed", currentProfileId);
        })
        .then(() => {
            logger.info("unfollowed user");
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