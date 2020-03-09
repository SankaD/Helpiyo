const logger = require('../utils/logger');
const Service = require('../models/service');
const Request = require('../models/request');

module.exports = (userId, serviceId) => {
    logger.info("get service recommendations for : " + serviceId);

    let service=null;

    return Service.findOne({_id: serviceId, status: "active", deleted: false, banned: false}).exec()
        .then(service2 => {
            if (!service2) {
                throw "request-not-found";
            }
            service = service2;
        })
        .then(() => {
            return {code: 200, requests: []};
        });
};