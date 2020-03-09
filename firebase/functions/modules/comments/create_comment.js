const moment = require("moment");
const logger = require('../utils/logger');
const Comment = require('../models/comments');

module.exports = function (userId, commentData) {
    logger.info("creating comment : " + userId + " : " + commentData.commentType);

    if (!userId) {
        return Promise.reject("user-id-required");
    }
    if (!commentData.targetId) {
        return Promise.reject("target-id-required");
    }

    let now = moment().utc().toDate();
    let comment = new Comment({
        from: userId,
        to: commentData.targetId,
        comment: commentData.comment,
        createdOn: now,
        modifiedOn: now,
        commentType: commentData.commentType,
        targetType: commentData.targetType,
    });

    return comment.save()
        .then((result) => {
            logger.info("comment created : " + result._id);
            return {code: 200, commentId: result._id.toString()};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};