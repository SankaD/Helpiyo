const logger = require('../utils/logger');
const Promotion = require('../models/promotion');

module.exports = (userId, requestId) => {
    logger.info("checking if request : " + requestId + " promoted by : " + userId);

    return Promotion.findOne({from: userId, to: requestId, deleted: false}).exec()
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