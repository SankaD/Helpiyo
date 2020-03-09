const logger = require('../utils/logger');
const Promotion = require('../models/service_promotion');

module.exports = (userId, serviceId) => {
    logger.info("checking if service : " + serviceId + " promoted by : " + userId);

    return Promotion.findOne({from: userId, to: serviceId, deleted: false}).exec()
        .then(result => {
            return Boolean(result);
        })
        .then((result) => {
            return {code: 200, promoted: result};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};