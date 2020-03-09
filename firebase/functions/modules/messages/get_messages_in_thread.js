const mongoose = require('mongoose');
const logger = require('../utils/logger');
const Message = require('../models/message');
const MessageThread = require('../models/message_thread');

module.exports = (userId, threadId) => {
    logger.info("getting messages in thread : " + threadId + " , user id : " + userId);

    return MessageThread.findOne({_id: threadId, participants: userId}).exec()
        .then(thread => {
            if (!thread) {
                throw "active-thread-not-found";
            }
            return Message.aggregate([
                {
                    "$match": {
                        threadId: mongoose.Types.ObjectId(threadId),
                    }
                }, {
                    "$lookup": {
                        from: "profiles",
                        localField: "createdBy",
                        foreignField: "_id",
                        as: "creator"
                    }
                },
                {
                    "$project": {
                        creator: 1,
                        message: 1,
                        _id: {"$toString": "$_id"},
                        createdOn: 1,
                        modifiedOn: 1,
                        createdBy: 1,
                        threadId: {"$toString": "$threadId"}
                    }
                }
            ])
                .exec();
        })
        .then(results => {
            let messages = [];
            let profiles = {};

            results.forEach(result => {
                let profile = result.creator[0];
                profiles[profile._id] = {
                    _id: profile._id,
                    modifiedOn: profile.modifiedOn,
                    heroName: profile.heroName,
                    profilePic: profile.profilePic,
                };
                let message = Object.assign({}, result);
                delete message.creator;
                messages.push(message);
            });
            return {messages: messages, profiles: profiles};
        })
        .then(results => {
            logger.info("messages received");
            return {code: 200, results};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};