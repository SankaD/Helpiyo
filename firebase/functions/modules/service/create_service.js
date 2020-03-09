const moment = require('moment');
const logger = require('../utils/logger');
const Service = require('../models/service');

module.exports = (userId, serviceData) => {
    logger.info("creating service");

    const now = moment().utc().toDate();
    serviceData.createdOn = now;
    serviceData.modifiedOn = now;
    serviceData.createdBy = userId;
    serviceData.tags = [];

    const service = new Service(serviceData);

    return service.save()
        .then(service => {
            logger.info("service saved");
            let newService = service.toJSON();
            newService._id = service._id.toString();
            return {code: 200, service: newService};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};