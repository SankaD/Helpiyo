const logger = require('../utils/logger');
const Point = require('../models/point');
const Profile = require('../models/profile');

module.exports = (userId) => {
    logger.info("getting karma data");
    return Point.aggregate([{
        $match: {
            profileId: userId,
        }
    }, {
        $sort: {
            createdOn: -1,
        }
    }, {
        $limit: 200
    }]).exec()
        .then(results => {
            return results.map(r => {
                return {
                    value: r.value + r.add,
                    createdOn: r.createdOn,
                    target: r.target,
                    type: r.type,
                };
            });
        })
        .then((results) => {
            logger.info("karma activities generated");
            return Profile.findById(userId).exec()
                .then(profile => {
                    return {code: 200, karmaActivities: results, karmaPoints: profile.points};
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