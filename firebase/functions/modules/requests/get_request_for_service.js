const logger = require('../utils/logger');
const Request = require('../models/request');
const Service = require('../models/service');
const getMultiple = require('./get_multiple');

module.exports = function (userId, serviceId) {
    logger.info("getting active requests for service : " + serviceId);

    return Service.findOne({_id: serviceId, createdBy: userId}).exec()
        .then(service => {
            if (!service) {
                throw "service-not-found";
            }
            return Request.find({
                serviceId: serviceId,
                deleted: false,
                banned: false,
                archived: false,
                status: "active"
            }, "_id")
                .limit(500)
                .exec();
        })
        .then(elements => elements.map(r => r._id))
        .then(requestIds => {
            return getMultiple(userId, requestIds);
        })
        .then(results => {
            logger.info("active requests found");
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
