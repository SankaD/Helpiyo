const moment = require("moment");
const Request = require('../models/request');
const Profile = require('../models/profile');
const logger = require('../utils/logger');
const checkPoints = require('../utils/check_points');

module.exports = function (userId, data) {
    logger.info('Creating request for : ' + userId);
    if (data.requestId) {
        const error = 'Key field is not expected on a new request';
        logger.error(error);
        return Promise.resolve().then(() => {
            throw "key-in-new-instance";
        });
    }

    const now = moment().utc().toDate();
    data.createdOn = now;
    data.modifiedOn = now;
    data.createdBy = userId;
    // data.location = {coordinates: [data.latitude, data.longitude]};
    data.photos = [];

    data.tags = data.tags.filter((v, i, a) => a.indexOf(v) === i);

    let type = data.sos ? "create-request-sos" : "create-request";
    return checkPoints(userId, type)
        .then(() => {
            const request = new Request(data);
            return request.save();
        })
        .then((request) => {
            if (!data.currency) {
                return Promise.resolve(request.toJSON());
            }
            return Profile.findByIdAndUpdate(userId, {defaultCurrency: data.currency, modifiedOn: now}).exec()
                .then(() => {
                    let newRequest = request.toJSON();
                    newRequest._id = request._id.toString();
                    return newRequest;
                });
        })
        .then((request) => {
            logger.info("request created successfully");
            return {code: 200, request: request, success: true};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};