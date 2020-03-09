const logger = require('../utils/logger');
const Achievement = require('../models/achievements');

module.exports = (userId, profileId) => {
    logger.info("getting achievements of user : " + profileId);

    return Achievement.aggregate([{
        $match: {
            $expr: {
                $eq: [{$toString: "$to"}, {$toString: profileId}]
            },
            deleted: false,
        }
    }, {
        $lookup: {
            from: "badges",
            localField: "from",
            foreignField: "_id",
            as: "badge"
        }
    }, {
        $sort: {
            createdOn: -1,
        }
    }])
        .exec()
        .then(results => {
            logger.info("achievements retrieved : " + results.length);
            return {code: 200, results};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};