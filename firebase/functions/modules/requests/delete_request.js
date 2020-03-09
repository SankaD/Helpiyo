const moment = require('moment');
const logger = require('../utils/logger');
const Response = require('../models/response');
const Request = require('../models/request');

module.exports = function (userId, requestId) {
    logger.info("deleting request : " + requestId);
    const now = moment().utc().toDate();

    return Request.findById(requestId).exec()
        .then(request => {
            if (!request || request.status !== "active" || request.deleted === true || request.banned === true) {
                throw "active-request-not-found";
            }
            if (request.createdBy !== userId) {
                throw "not-request-creator";
            }
            return Response.findOne({
                requestId: requestId,
                status: {"$in": ["completed", "accepted", "rejected"]}
            }).exec();
        })
        .then(response => {
            if (response) {
                throw "active-responses-found";
            }
            return Response.updateMany({requestId: requestId, deleted: true, banned: false}, {
                status: "completed",
                resolution: "deleted",
                modifiedOn: now
            }).exec();
        })
        .then(() => {
            return Request.findByIdAndUpdate(requestId, {deleted: true, modifiedOn: now}).exec();
        })
        .then(() => {
            logger.info("deleted request : " + requestId);
            return {code: 200};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};