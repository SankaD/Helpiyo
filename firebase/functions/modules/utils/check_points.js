const Profile = require('../models/profile');
const PointTable = require('../models/point_table');
const logger = require('../utils/logger');

module.exports = (userId, type) => {
    logger.info(`checking points for ${userId} for ${type}`);

    return PointTable.findOne({type: type, status: "active"}).exec()
        .then(result => {
            if (!result) {
                throw "unknown-action-type";
            }
            let value = result.value;
            if (value >= 0) {
                logger.info(`type : ${type} doesn't need checking since value = ${value}`);
                return Promise.resolve();
            }
            
            value = Math.abs(value);
            return Profile.findById(userId).exec()
                .then(profile => {
                    if (!profile) {
                        throw "profile-not-found";
                    }
                    if (profile.points <= 0) {
                        throw "insufficient-funds";
                    }

                    if (profile.points < value) {
                        throw "insufficient-funds";
                    }
                    logger.info(`user has enough funds : ${profile.points} for value : ${value}`);
                    return Promise.resolve();
                });
        });
};