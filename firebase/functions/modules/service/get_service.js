const logger = require('../utils/logger');
const Service = require('../models/service');
const getMultiple = require('./get_multiple');

module.exports = (userId, serviceId) => {
    logger.info("getting service : " + serviceId);
    return Service.findOne({
        _id: serviceId,
        deleted: false,
        banned: false,
        status: {$in: ["active", "inactive"]}
    }).exec()
        .then(service => {
            if (!service) {
                throw "service-not-found";
            }
            if (service.createdBy !== userId && service.status === "inactive") {
                logger.info("service is inactive");
                throw "service-not-found";
            }
            let ids = [service._id.toString()];
            return getMultiple(userId, ids);
        })
        .then(results => {
            return results;
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};