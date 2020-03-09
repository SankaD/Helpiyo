const Service = require('../models/service');
const logger = require('../utils/logger');
const addPoints = require('../utils/add_points');

module.exports = (userId, serviceId) => {
    logger.info("activating service : " + serviceId);

    return Service.findOne({_id: serviceId, createdBy: userId, status: "draft"}).exec()
        .then(service => {
            if (!service) {
                throw "service-not-found";
            }
            service.status = "active";
            return service.save()
                .then(() => {
                    return addPoints(userId, "enable-service", serviceId);
                });
        })
        .then(() => {
            logger.info("service activated");
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