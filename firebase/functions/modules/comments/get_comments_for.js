const logger = require('../utils/logger');
const mongoose = require('mongoose');
const Comment = require('../models/comments');

module.exports = (userId, targetType, targetId) => {
    logger.info("getting comments for : " + targetId + " of " + targetType + " by : " + userId);

    if (!targetId) {
        return Promise.reject("target-id-required");
    }
    return Comment.aggregate([{
        "$match": {
            to: mongoose.Types.ObjectId(targetId),
            targetType: targetType,
            deleted: false,
        }
    }, {
        "$lookup": {
            from: "profiles",
            localField: "from",
            foreignField: "_id",
            as: "creator"
        }
    }, {
        "$project": {
            creator: 1,
            createdOn: 1,
            modifiedOn: 1,
            from: 1,
            to: {"$toString": "$to"},
            _id: {"$toString": "$_id"},
            targetType: 1,
            comment: 1,
            commentType: 1
        }
    }])
        .sort({modifiedOn: 1, from: 1})
        .limit(500)
        .exec()
        .then(results => {
            let comments = [];
            let profiles = {};
            results.forEach(result => {
                let profile = result.creator[0];
                let comment = Object.assign({}, result);
                delete comment.creator;
                comments.push(comment);
                profiles[profile._id] = {
                    _id: profile._id,
                    modifiedOn: profile.modifiedOn,
                    heroName: profile.heroName,
                    profilePic: profile.profilePic,
                };
            });
            return {comments: comments, profiles: profiles};
        })
        .then(result => {
            logger.info("retrieved comment count : " + result.comments.length);
            return {code: 200, results: result};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};