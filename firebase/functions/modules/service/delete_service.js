const logger = require('../utils/logger');
const Service = require('../models/service');
const moment = require('moment');

module.exports = (userId, serviceId) => {
    logger.info("deleting service : " + serviceId);

    return Service.findById(serviceId).exec()
        .then(service => {
            if (!service) {
                throw "service-not-found";
            }
            if (service.createdBy !== userId) {
                throw "not-service-creator";
            }
            service.deleted = true;
            service.modifiedOn = moment().utc().toDate();

            return service.save();
        })
        .then(() => {
            logger.info("service deleted");
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