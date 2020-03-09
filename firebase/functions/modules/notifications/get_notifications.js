const logger = require('../utils/logger');
const Notification = require('../models/notification');

module.exports = (userId) => {
    logger.info("getting notifications");
    return Notification.find({to: userId, read: false}).sort({modifiedOn: 1}).limit(100).lean().exec()
        .then(notifications => {
            logger.info("notifications received : " + notifications.length);
            return {code: 200, notifications};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};