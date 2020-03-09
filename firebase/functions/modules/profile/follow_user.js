const moment = require("moment");
const logger = require('../utils/logger');
const follows = require('../models/follows');
const addPoints = require('../utils/add_points');
const checkPoints = require('../utils/check_points');

module.exports = function (currentProfileId, profileId) {
    logger.info("follow user");
    logger.info(arguments);
    if (currentProfileId === profileId) {
        logger.warn("current user cannot follow itself");
        return Promise.reject("cannot-follow-himself");
    }
    return checkPoints(currentProfileId, "follow-user")
        .then(() => {
            return follows.findOne({from: currentProfileId, to: profileId, deleted: false}).exec();
        })
        .then(edge => {
            if (edge) {
                throw "already-followed";
            }
            let item = new follows({
                from: currentProfileId,
                to: profileId,
                createdOn: moment().utc().toDate(),
                modifiedOn: moment().utc().toDate()
            });
            return item.save();
        })
        .then(() => {
            return addPoints(currentProfileId, "follow-user", profileId);
        })
        .then(() => {
            return addPoints(profileId, "being-followed", currentProfileId);
        })
        .then(() => {
            logger.info("successfully followed user");
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