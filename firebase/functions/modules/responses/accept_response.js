const moment = require('moment');
const logger = require('../utils/logger');
const notifyUsers = require('../utils/notify_users');
const Response = require('../models/response');
const Request = require('../models/request');
const Notification = require('../models/notification');

module.exports = function (userId, responseId) {
    logger.info("Accepting response : " + responseId + " by : " + userId);

    let now = moment().utc().toDate();
    return Response.findOne({
        _id: responseId,
        status: {"$in": ["active", "rejected"]},
        deleted: false,
        banned: false
    }).exec()
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
                        throw "request-not-found";
                    }
                    return response.updateOne({
                        status: "accepted",
                        requesterRating: 0,
                        requesterComment: "",
                        modifiedOn: now
                    }).exec()
                        .then(() => {
                            return request;
                        });
                })
                .then(request => {
                    let notification = new Notification({
                        from: response._id.toString(),
                        to: response.createdBy,
                        modifiedOn: now,
                        createdOn: now,
                        read: false,
                        type: "accept-response"
                    });
                    return notification.save();
                })
                .then(() => {
                    return notifyUsers([response.createdBy], "Your response was accepted", response.post, response._id.toString());
                });
        })
        .then(() => {
            logger.info("Response accepted");
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