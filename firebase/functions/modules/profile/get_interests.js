const logger = require('../utils/logger');
const Profile = require('../models/profile');

module.exports = (profileId) => {
    logger.info("getting interests : " + profileId);

    return Profile.findById(profileId).exec()
        .then((profile) => {
            if (!profile) {
                throw "profile-not-found";
            }
            logger.info("interests received");
            return {code: 200, interests: profile.interests};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};