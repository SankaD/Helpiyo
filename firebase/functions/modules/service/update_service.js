const moment = require('moment');
const logger = require('../utils/logger');
const Service = require('../models/service');

module.exports = (userId, serviceData) => {
    logger.info("updating service");

    const now = moment().utc().toDate();

    return Service.findOne({_id: serviceData._id, createdBy: userId, banned: false, deleted: false}).exec()
        .then((service) => {
            if (!service) {
                logger.error("service not found");
                throw "service-not-found";
            }
            service.modifiedOn = now;
            service.post = serviceData.post;
            service.title = serviceData.title;
            service.location = serviceData.location;
            service.locationSet = serviceData.locationSet;
            service.money = serviceData.money;
            service.currency = serviceData.currency;

            return service.save();
        })
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