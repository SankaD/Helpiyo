const logger = require('../utils/logger');
const follows = require('../models/follows');
// const DbManager = require('../db/db_manager');

module.exports = function (currentProfileId, profileId) {
    logger.info("is follow user");
    logger.info(arguments);
    if (currentProfileId === profileId) {
        logger.warn("current user cannot follow himself");
        return Promise.reject("current-user-cannot-follow");
    }

    return follows.findOne({from: currentProfileId, to: profileId, deleted: false}).exec()
        .then(edge => {
            return {code: 200, following: Boolean(edge)};
        })
        .catch(error => {
            logger.warn(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};