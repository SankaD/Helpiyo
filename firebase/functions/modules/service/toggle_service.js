const logger = require('../utils/logger');
const Service = require('../models/service');
const addPoints = require('../utils/add_points');

module.exports = (userId, serviceId) => {
    logger.info("toggling service : " + serviceId);
    return Service.findOne({
        _id: serviceId,
        createdBy: userId,
        deleted: false,
        status: {"$ne": "draft"}
    }).exec()
        .then(service => {
            if (!service) {
                logger.info("service not found");
                throw "service-not-found";
            }
            service.status = (service.status === "active" ? "inactive" : "active");
            return service.save()
                .then(() => {
                    return addPoints(userId, service.status === "active" ? "enable-service" : "disable-service", serviceId);
                });
        })
        .then(() => {
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