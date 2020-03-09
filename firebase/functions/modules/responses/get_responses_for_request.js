const logger = require('../utils/logger');
const getMultiple = require('./get_multiple');
const Response = require('../models/response');
const Request = require('../models/request');

module.exports = function (userId, requestId) {
    logger.info("getting responses for request : " + requestId + " by userId: " + userId);

    return Request.findOne({_id: requestId, createdBy: userId, deleted: false, banned: false}).exec()
        .then(request => {
            if (!request) {
                throw "active-request-not-found";
            }
            return Response.find({
                requestId: requestId,
                status: {"$ne": "draft"},
                deleted: false,
                banned: false
            }, "_id").exec();
        })
        .then(responses => responses.map(r => r._id))
        .then(responseIds => {
            return getMultiple(userId, responseIds);
        })
        .then(results => {
            logger.info("response count = " + results.results.responses.length);
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