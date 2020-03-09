const logger = require('../utils/logger');
const sendSosNotification = require('./send_sos_notification');
const notifyUsers = require('../utils/notify_users');
const Request = require('../models/request');
const Service = require('../models/service');
const addPoints = require('../utils/add_points');

module.exports = function (userId, requestId) {
    logger.info("activate request : " + requestId + " by : " + userId);

    return Request.findOneAndUpdate({
            _id: requestId,
            createdBy: userId,
            status: "draft",
            deleted: false,
            banned: false
        },
        {status: "active"}).exec()
        .then(result => {
            return addPoints(userId, result.sos ? "create-request-sos" : "create-request", requestId)
                .then(() => {
                    return result;
                });
        })
        .then((result) => {
            if (!result) {
                throw "active-request-not-found";
            }
            if (result.serviceId) {
                return Service.findById(result.serviceId).exec()
                    .then(service => {
                        if (!service) {
                            logger.error("service not found");
                            return Promise.resolve();
                        }
                        return notifyUsers([service.createdBy.toString()], "Someone requested your service", result.post, result.serviceId.toString());
                    });
            }
            if (!result.sos) {
                return result.toJSON();
            }
            logger.info("sending sos notifications for request");
            return sendSosNotification(result)
                .catch(error => {
                    logger.error("couldn't send sos notification");
                    logger.error(error);
                })
                .then(() => {
                    return result.toJSON();
                });
        })
        .then(() => {
            return Request.findById(requestId).lean().exec();
        })
        .then(result => {
            return {code: 200, request: result};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};