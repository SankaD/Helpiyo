const moment = require('moment');
const logger = require('../utils/logger');
const Request = require('../models/request');
const Service = require('../models/service');
const Profile = require('../models/profile');
const addPoints = require('../utils/add_points');
const checkPoints = require('../utils/check_points');

module.exports = (userId, elementId, elementType) => {
    logger.info("boosting item : " + elementId + " of : " + elementType);

    let expireDate = moment().add(7, "days").utc().toDate();

    let model = Request;
    let limit = 1000;
    if (elementType === "boost-request") {
        model = Request;
        limit = 1000;
    } else if (elementType === "boost-service") {
        model = Service;
        limit = 10000;
    } else {
        return Promise.reject("unknown-element-type");
    }
    return checkPoints(userId, elementType)
        .then(() => {
            return Profile.findById(userId).exec();
        })
        .then(profile => {
            if (profile.points < limit) {
                throw "not-enough-points";
            }
            return model.findOne({_id: elementId, createdBy: userId, status: "active"}).exec();
        })
        .then((element) => {
            if (!element) {
                throw "element-not-found";
            }
            element.boostedTill = expireDate;
            element.boosted = true;
            return element.save();
        })
        .then(() => {
            return addPoints(userId, elementType, elementId);
        })
        .then(() => {
            return Profile.updateOne({_id: userId}, {$inc: {points: -1 * limit}}).exec();
        })
        .then(() => {
            logger.info("element boosted");
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