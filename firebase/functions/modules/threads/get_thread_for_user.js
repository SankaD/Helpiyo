const moment = require('moment');
const logger = require('../utils/logger');
const getMultiple = require('./get_multiple');
const MessageThread = require('../models/message_thread');
const Reading = require('../models/message_reading');
const Message = require('../models/message');

module.exports = function (userId, otherUserId) {
    logger.info("getting thread for user : " + otherUserId + " by " + userId);

    let now = moment().utc().toDate();
    return MessageThread.findOne({
        participants: {
            "$size": 2,
            "$all": [userId, otherUserId]
        }
    })
        .exec()
        .then(thread => {
            if (!thread) {
                let thread = new MessageThread({
                    createdOn: now,
                    modifiedOn: now,
                    createdBy: userId,
                    participants: [userId, otherUserId]
                });
                return thread.save()
                    .then(t => t._id)
                    .then(threadId => {
                        let promises = [userId, otherUserId].map(userId => {
                            let reading = new Reading({
                                threadId: threadId,
                                participant: userId,
                                lastReadOn: now,
                                lastMessagedOn: now,
                            });
                            return reading.save();
                        });
                        return Promise.all(promises)
                            .then(() => {
                                return threadId;
                            });
                    });
            }
            return thread._id;
        })
        .then(threadId => {
            logger.info("thread id found");
            logger.debug(threadId);
            return getMultiple(userId, [threadId]);
        })
        .then(results => {
            logger.info("thread retrieved");
            return {code: 200, results: {thread: results.results.threads[0], profiles: results.results.profiles}};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};