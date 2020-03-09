const moment = require('moment');
const logger = require('../utils/logger');
const Profile = require('../models/profile');

module.exports = (userId, displayName) => {
    logger.info("updating display name of : " + userId + " to : " + displayName);

    // return Profile.findOne({heroNameLower: displayName.toLowerCase()}).exec()
    //     .catch(error => {
    //         logger.error(error);
    //         throw "db-error";
    //     })
    //     .then(profile => {
    //         if (profile) {
    //             logger.info("name already exists");
    //             throw "hero-name-exists";
    //         }

    return Profile.findByIdAndUpdate(userId, {
        heroName: displayName,
        heroNameLower: displayName.toLowerCase(),
        modifiedOn: moment().utc().toDate()
    }).exec()
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        })
        .then(() => {
            logger.info("hero name updated");
            return {code: 200};
        });
    // });
};