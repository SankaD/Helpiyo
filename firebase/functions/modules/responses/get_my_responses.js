const logger = require('../utils/logger');
const getMultiple = require('./get_multiple');
const Response = require('../models/response');

module.exports = function (userId) {
    logger.info("getting responses for user : " + userId);

    return Response.find({createdBy: userId, status: {"$ne": "draft"}, deleted: false, banned: false}, "_id").exec()
        .then(responses => responses.map(r => r._id))
        .then(responseIds => {
            return getMultiple(userId, responseIds);
        })
        .then(results => {
            logger.info("received response count : " + results.results.responses.length);
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