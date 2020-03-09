const logger = require('../utils/logger');
const getMultiple = require('./get_multiple');
const Request = require('../models/request');
//
module.exports = function (userId) {
    logger.info('getting requests by : ' + userId);

    return Request.find({
        createdBy: userId,
        deleted: false,
        banned: false,
        archived: false,
        status: {"$ne": "draft"}
    }).sort({modifiedOn: 1})
        .limit(100)
        .exec()
        .then(requests => {
            let requestIds = requests.map(r => r._id);
            return getMultiple(userId, requestIds);
        })
        .then(results => {
            logger.info("active requests found");
            return {code: 200, results: results.results};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};