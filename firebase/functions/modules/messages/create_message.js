const moment = require("moment");

const logger = require('../utils/logger');
const Reading = require('../models/message_reading');
const Message = require('../models/message');
const MessageThread = require('../models/message_thread');
const notifyUsers = require('../utils/notify_users');

module.exports = (userId, threadId, text) => {
    logger.info("new message : " + userId + " : " + threadId);

    let now = moment().utc().toDate();
    return MessageThread.findOne({_id: threadId, participants: userId, banned: false}).exec()
        .then(thread => {
            if (!thread) {
                throw "active-thread-not-found";
            }
            let message = new Message({
                message: text,
                createdOn: now,
                modifiedOn: now,
                createdBy: userId,
                threadId: threadId,
                banned: false,
            });
            let newMessage;
            return message.save()
                .then(message => {
                    thread.modifiedOn = now;
                    newMessage = message.toJSON();
                    newMessage._id = message._id.toString();
                    newMessage.threadId = message.threadId.toString();
                    return thread.save();
                })
                .then(() => {
                    return Reading.updateMany({
                        threadId: threadId,
                        participant: {"$ne": userId}
                    }, {lastMessagedOn: now}).exec();
                })
                .then(() => {
                    let profileIds = thread.participants.filter(participant => {
                        return participant !== userId;
                    });
                    return notifyUsers(profileIds, "A message received", text, threadId);
                })
                .then(() => {

                    return message.toJSON();
                });
        })
        .then((message) => {
            logger.info("message created");
            return {code: 200, messageResult: message};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};