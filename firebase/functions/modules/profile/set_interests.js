const logger = require('../utils/logger');
const Profile = require('../models/profile');

module.exports = (profileId, interests) => {
    logger.info("setting interests : " + profileId);

    return Profile.updateOne({_id: profileId}, {interests: interests}).exec()
        .then(() => {
            logger.info("interests set");
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