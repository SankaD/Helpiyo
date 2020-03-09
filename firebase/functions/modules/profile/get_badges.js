const logger = require('../utils/logger');
const Profile = require('../models/profile');
const DbManager = require('../db/db_manager');

module.exports = (profileId) => {
    logger.info("get badges : " + profileId);
    // return Profile.findOne({
    //     _id: profileId,
    //     banned: false,
    //     deactivated: false
    // }).exec()
    //     .catch(error => {
    //         logger.error(error);
    //         throw Errors.dbError;
    //     })
    //     .then(profile => {
    //         if (!profile) {
    //             logger.warn("profile not found");
    //             throw Errors.profileNotFound;
    //         }
    //         if (profile.status !== "active") {
    //             logger.warn("profile not active");
    //             throw Errors.profileNotActive;
    //         }
    //         return profile.badges.map(badge => {
    //             let newBadge = badge.toJSON();
    //             newBadge._id = badge._id;
    //             return newBadge;
    //         });
    //     })
    //     .then(badges => {
    //         logger.info("badges retrieved. count : " + badges.length);
    //         return {
    //             code: 200,
    //             badges
    //         };
    //     });
};