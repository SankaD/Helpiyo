const logger = require('../utils/logger');
const Service = require('../models/service');
const Request = require('../models/request');

module.exports = (userId, requestId) => {
    logger.info("get request recommendations for : " + requestId);

    let request=null;

    return Request.findOne({_id: requestId, status: "active", deleted: false, banned: false}).exec()
        .then(request2 => {
            if (!request2) {
                throw "request-not-found";
            }
            request = request2;
        })
        .then(() => {
            return {code: 200, services: []};
        });
};