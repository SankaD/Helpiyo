const moment = require('moment');
const Profile = require('../models/profile');
const follows = require('../models/follows');
const Points = require('../models/point');
const logger = require('../utils/logger');
const addPoints = require('../utils/add_points');

function markDailyUsage(profileId) {
    logger.info("checking for daily usage");
    let targetString = moment().utc().startOf("day");
    return Points.findOne({
        type: "daily-usage",
        target: targetString,
        profileId: profileId
    })
        .then(result => {
            if (result) {
                logger.info("already marked with daily usage");
                return Promise.resolve();
            }

            return addPoints(profileId, "daily-usage", targetString);
        });
}

module.exports = function (currentUserId, profileId) {
    logger.info("getting profile : " + currentUserId + " : " + profileId);
    if (!currentUserId || currentUserId === "") {
        return Promise.reject("profile-id-required");
    }

    return Profile.findOne({_id: profileId, status: "active", banned: false, deactivated: false}).exec()
        .catch(error => {
            logger.error(error);
            throw error;
        })
        .then(profile => {
            if (currentUserId === profileId) {
                return markDailyUsage(currentUserId, currentUserId)
                    .then(() => {
                        return profile;
                    });
            }
            return profile;
        })
        .then(profile => {
            if (!profile) {
                return {code: 200, profile: null};
            }
            logger.info("profile received");
            return follows.countDocuments({to: profileId, deleted: false})
                .catch(error => {
                    logger.error(error);
                    throw error;
                })
                .then(count => {
                    let newProfile = profile.toJSON();
                    newProfile.followerCount = count;
                    logger.info("profile received : " + profileId + ", followerCount : " + count);
                    return {code: 200, profile: newProfile};
                });
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};