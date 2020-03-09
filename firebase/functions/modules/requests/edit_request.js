const moment = require("moment");
const logger = require('../utils/logger');
const Request = require('../models/request');

module.exports = (userId, data) => {
    logger.info("editing request : " + data._id + " by user : " + userId);

    return Request.findById(data._id).exec()
        .then(request => {
            if (!request || request.deleted === true || request.status !== "active" || request.banned === true) {
                throw "active-request-not-found";
            }
            if (request.createdBy !== userId) {
                throw "not-request-creator";
            }
            return request.updateOne({
                post: data.post,
                location: data.location,
                startTime: data.startTime,
                endTime: data.endTime,
                money: data.money,
                currency: data.currency,
                photos: data.photos,
                tags: data.tags,
                modifiedOn: moment().utc().toDate(),
            }).exec();
        })
        .then(() => {
            logger.info("request edited");
            return {code: 200, requestId: data._id};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};
