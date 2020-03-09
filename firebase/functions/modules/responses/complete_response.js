const logger = require('../utils/logger');
const moment = require('moment');
const notifyUsers = require('../utils/notify_users');
const Response = require('../models/response');
const Request = require('../models/request');
const Notification = require('../models/notification');

module.exports = function (userId, responseId, rating, comment) {
    logger.info("Completing response");

    let now = moment().utc().toDate();
    return Response.findOne({
        _id: responseId,
        createdBy: userId,
        status: "accepted",
        deleted: false,
        banned: false
    }).exec()
        .then(response => {
            if (!response) {
                throw "active-response-not-found";
            }
            return Request.findOne({_id: response.requestId, status: "active", deleted: false, banned: false}).exec()
                .then(request => {
                    if (!request) {
                        throw "active-request-not-found";
                    }
                    return response.updateOne({
                        status: "completed",
                        resolution: "accepted",
                        modifiedOn: now,
                        responderRating: rating,
                        responderComment: comment
                    })
                        .then(() => {
                            let notification = new Notification({
                                from: response._id.toString(),
                                to: request.createdBy,
                                modifiedOn: now,
                                createdOn: now,
                                read: false,
                                type: "complete-response"
                            });
                            return notification.save();
                        })
                        .then(() => {
                            return notifyUsers([request.createdBy], "Someone completed their response", response.post, response._id.toString());
                        });
                });
        })
        .then(() => {
            logger.info("successfully completed response");
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