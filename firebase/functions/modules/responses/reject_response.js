const moment = require('moment');
const logger = require('../utils/logger');
const Response = require('../models/response');
const Request = require('../models/request');
const Notification = require('../models/notification');
const notifyUsers = require('../utils/notify_users');

module.exports = function (userId, responseId, rating, comment) {
    logger.info("rejecting response : " + responseId);

    let now = moment().utc().toDate();

    return Response.findOne({
        _id: responseId,
        status: {"$in": ["active", "accepted"]},
        deleted: false,
        banned: false
    })
        .exec()
        .then(response => {
            if (!response) {
                throw "active-response-not-found";
            }
            return Request.findOne({
                _id: response.requestId,
                createdBy: userId,
                status: "active",
                deleted: false,
                banned: false
            })
                .exec()
                .then(request => {
                    if (!request) {
                        throw "active-request-not-found";
                    }
                    return response.updateOne({
                        status: "rejected",
                        requesterRating: rating,
                        requesterComment: comment,
                        modifiedOn: now,
                    }).exec();
                })
                .then(() => {
                    let notification = new Notification({
                        from: response._id.toString(),
                        to: response.createdBy,
                        type: "reject-response",
                        modifiedOn: now,
                        createdOn: now,
                        read: false,
                    });
                    return notification.save();
                })
                .then(() => {
                    return notifyUsers([response.createdBy], "Your response was rejected", response.post, response._id.toString());
                });
        })
        .then(() => {
            logger.info("response rejected");
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