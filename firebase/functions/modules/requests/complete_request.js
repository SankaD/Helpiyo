const moment = require('moment');
const logger = require('../utils/logger');
const Request = require('../models/request');
const Response = require('../models/response');
const Notification = require('../models/notification');
const addPoints = require('../utils/add_points');

module.exports = function (userId, requestId, rating, comment) {
    logger.info("completing requests : " + requestId);
    const now = moment().utc().toDate();
    let currentRequest = null;
    let isSos = false;
    return Request.findOne({
        _id: requestId,
        createdBy: userId,
        deleted: false,
        status: "active",
        banned: false
    })
        .exec()
        .then(request => {
            if (!request) {
                throw "active-request-not-found";
            }
            currentRequest = request;
            isSos = request.sos;
            let promises = [];
            let promise = Response.updateMany({
                requestId: requestId,
                status: "active",
                deleted: false,
                banned: false
            }, {
                status: "completed",
                resolution: "ignored",
                modifiedOn: now
            }).exec();
            promises.push(promise);

            promise = Response.updateMany({
                requestId: requestId,
                status: "accepted",
                deleted: false,
                requesterRating: {$ne: 0},
                banned: false
            }, {
                status: "completed",
                resolution: "accepted",
                modifiedOn: now
            }).exec();
            promises.push(promise);


            promise = Response.updateMany({
                requestId: requestId,
                status: "accepted",
                deleted: false,
                requesterRating: 0,
                banned: false
            }, {
                status: "completed",
                resolution: "accepted",
                requesterRating: rating,
                requesterComment: comment,
                modifiedOn: now
            }).exec();
            promises.push(promise);

            promise = Response.updateMany({
                requestId: requestId,
                status: "rejected",
                deleted: false,
                banned: false
            }, {
                status: "completed",
                resolution: "rejected",
                modifiedOn: now
            }).exec();
            promises.push(promise);

            promise = Response.updateMany({
                requestId: requestId,
                status: "completed",
                resolution: 'accepted',
                deleted: false,
                requesterRating: 0,
                banned: false
            }, {
                requesterRating: rating,
                requesterComment: comment,
                modifiedOn: now
            }).exec();
            promises.push(promise);

            return Promise.all(promises);
        })
        .then(() => {
            return Request.findByIdAndUpdate(requestId, {
                status: "completed",
                requesterRating: rating,
                requesterComment: comment
            }).exec();
        })
        .then(() => {
            return Response.find({
                requestId: requestId,
                resolution: "accepted",
                status: "completed",
                banned: false,
            })
                .exec()
                .then(ids => {
                    let promises = ids.map(response => {
                        let notification = new Notification({
                            from: requestId,
                            to: response.createdBy,
                            type: "complete-request",
                            createdOn: now,
                            modifiedOn: now,
                            read: false,
                        });
                        return notification.save()
                            .then(() => {
                                return addPoints(response.createdBy, isSos ? "complete-response-sos" : "complete-response", response._id);
                            });
                    });

                    let promise = addPoints(userId, isSos ? "complete-request-sos" : "complete-request", requestId);
                    promises.push(promise);

                    return Promise.all(promises);
                });
        })
        .then(() => {
            logger.info("successfully completed request");
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