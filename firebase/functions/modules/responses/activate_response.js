const moment = require('moment');
const logger = require('../utils/logger');
const notifyUsers = require('../utils/notify_users');
const Request = require('../models/request');
const Response = require("../models/response");
const Notification = require('../models/notification');
const addPoints = require('../utils/add_points');

module.exports = function (userId, responseId) {
    logger.info("activate response : " + responseId + " by : " + userId);
    let now = moment().utc().toDate();
    return Response.findOne({_id: responseId, status: "draft", deleted: false, banned: false, createdBy: userId}).exec()
        .then(response => {
            if (!response) {
                throw "response-not-found";
            }
            return Request.findOne({_id: response.requestId, status: "active", deleted: false, banned: false}).exec()
                .then(request => {
                    if (!request) {
                        throw "active-request-not-found";
                    }
                    return response.updateOne({status: "active", modifiedOn: now}).exec()
                        .then(() => {
                            return addPoints(userId, request.sos ? "create-response-sos" : "create-response", responseId);
                        })
                        .then(() => {
                            return request;
                        });
                })
                .then((request) => {
                    let notification = new Notification({
                        from: response._id.toString(),
                        to: request.createdBy,
                        createdOn: now,
                        modifiedOn: now,
                        read: false,
                        type: "create-response"
                    });
                    return notification.save()
                        .then((notification) => {
                            return notifyUsers([request.createdBy], "Someone responded to your request", response.post, response._id.toString());
                        });
                });
        })
        .then(() => {
            logger.info("response activated");
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