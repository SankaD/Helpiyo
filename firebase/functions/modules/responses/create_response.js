const moment = require("moment");
const checkPoints = require('../utils/check_points');
const logger = require('../utils/logger');
const Request = require('../models/request');
const Response = require('../models/response');

module.exports = (userId, responseData) => {
    logger.info("creating response. userId : " + userId + ", requestId : " + responseData.requestId);
    let now = moment().utc().toDate();

    return Request.findOne({
        _id: responseData.requestId,
        deleted: false,
        banned: false,
        status: "active",
        createdBy: {"$ne": userId}
    }).exec()
        .then(request => {
            if (!request) {
                throw "active-request-not-found";
            }
            const type = request.sos ? "create-response-sos" : "create-response";
            return checkPoints(userId, type)
                .then(() => {
                    responseData.createdOn = now;
                    responseData.modifiedOn = now;
                    responseData.createdBy = userId;
                    responseData.status = "draft";
                    responseData.banned = false;
                    responseData.photos = [];
                    responseData.requestCreatorId = request.createdBy;

                    let response = new Response(responseData);
                    return response.save();
                });
        })
        .then(response => {
            let newResponse = response.toJSON();
            newResponse._id = response._id.toString();
            return newResponse;
        })
        .then(response => {
            logger.info("created response : " + response._id);
            return {code: 200, response: response};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};