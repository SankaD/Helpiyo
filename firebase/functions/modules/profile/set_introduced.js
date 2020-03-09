const moment = require('moment');
const logger = require('../utils/logger');
const Profile = require('../models/profile');

module.exports = (userId) => {
    logger.info("set introduced : " + userId);

    return Profile.findById(userId).exec()
        .then(profile => {
            if (!profile) {
                throw "profile-not-found";
            }
            profile.introDone = true;
            profile.modifiedOn = moment().utc().toDate();
            return profile.save();
        })
        .then(() => {
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