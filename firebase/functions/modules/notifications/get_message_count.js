const logger = require('../utils/logger');
const MessageThread = require('../models/message_thread');
const Reading = require('../models/message_reading');
const Message = require('../models/message');

module.exports = (userId) => {
    logger.info("getting message notifications count");

    return Reading.aggregate([
        {
            "$match": {
                participant: userId,
                lastReadOn: {
                    "$lt": "$lastMessagedOn"
                }
            },

        }, {
            "$count": "count",
        }, {
            "$project": {
                "count": 1
            }
        }])
        .exec()
        .then(results => results[0] || 0)
        .then(count => {
            logger.info("message notifications received : " + count);
            return {code: 200, count: count};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};