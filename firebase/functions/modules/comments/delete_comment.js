const moment = require('moment');
const Comment = require('../models/comments');
const logger = require('../utils/logger');

module.exports = (userId, commentId) => {
    logger.info("deleting comment : " + commentId + " by : " + userId);

    return Comment.findOne({_id: commentId, from: userId, deleted: false}).exec()
        .then(comment => {
            if (!comment) {
                throw "comment-not-found";
            }
            return comment.updateOne({deleted: true, modifiedOn: moment().utc().toDate()}).exec();
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};