const logger = require('../utils/logger');
const Request = require('../models/request');
const getMultiple = require('./get_multiple');

module.exports = function (userId, profileId) {
    logger.info("getting active requests by : " + profileId);

    return Request.find({
        createdBy: profileId,
        deleted: false,
        banned: false,
        archived: false,
        status: "active"
    }, "_id").limit(100).exec()
        .then(elements => elements.map(r => r._id))
        .then(requestIds => {
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
