const moment = require('moment');
const MessageReading = require('../models/message_reading');
const Message = require('../models/message');
const logger = require('../utils/logger');

module.exports = (userId, threadId) => {
    logger.info("marking message thread as read");

    let now = moment().utc().toDate();

    return MessageReading.findOne({threadId: threadId, participant: userId}).exec()
        .then(thread => {
            if (thread) {
                thread.lastReadOn = now;
                return thread.save();
            }
            throw "readings-not-found";
        })
        .then(() => {
            logger.info("message thread marked as read");
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