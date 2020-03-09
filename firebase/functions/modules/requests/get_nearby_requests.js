const logger = require('../utils/logger');
const getMultiple = require('./get_multiple');
const Request = require('../models/request');

module.exports = function (userId, latitude, longitude, radius) {
    logger.info("getting nearby requests");

    if (radius === 0) {
        radius = 100000;
    }

    return Request.aggregate()
        .near({
            near: [parseFloat(String(longitude)), parseFloat(String(latitude))],
            maxDistance: radius,
            distanceField: "location",
            spherical: true,
            query: {deleted: false, status: "active", archived: false, banned: false, locationSet: true}
        })
        .limit(200)
        .exec()
        .then(ids => ids.map(id => id._id.toString()))
        .then(requestIds => {
            return getMultiple(userId, requestIds);
        })
        .then(results => {
            logger.info("requests received");
            return {code: 200, results: results.results};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};