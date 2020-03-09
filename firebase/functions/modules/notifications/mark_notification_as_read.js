const moment = require('moment');
const logger = require('../utils/logger');
const Notification = require('../models/notification');

module.exports = (userId, notificationId) => {
    logger.info("marking notification id as read : " + notificationId + " by :" + userId);
    let now = moment().utc().toDate();

    return Notification.updateOne({_id: notificationId, to: userId}, {read: true, modifiedOn: now}).exec()
        .then(() => {
            logger.info("notification marked as read");
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