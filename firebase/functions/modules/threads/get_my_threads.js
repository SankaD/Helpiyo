const logger = require('../utils/logger');
const getMultiple = require('./get_multiple');
const MessageThread = require('../models/message_thread');

module.exports = (userId) => {
    logger.info("getting my threads");

    return MessageThread.aggregate([{
        $match: {
            participants: userId,
            deletedBy: {$ne: userId}
        }
    }, {
        $lookup: {
            from: 'messages',
            as: 'messages',
            let: {chatId: "$_id"},
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: [{$toString: "$$chatId"}, {$toString: "$threadId"}]
                    }
                }
            }, {
                $project: {
                    _id: 1
                }
            }]
        }
    }, {
        $project: {
            _id: 1,
            readBy: 1,
            participants: 1,
            createdOn: 1,
            modifiedOn: 1,
            createdBy: 1,
            messageCount: {
                $size: "$messages"
            }
        }
    }
    ]).exec()
        .then(threads => threads.filter(e => e.messageCount > 0).map(e => e._id))
        .then(threadIds => {
            return getMultiple(userId, threadIds);
        })
        .then(results => {
            return {code: 200, results: results.results};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};