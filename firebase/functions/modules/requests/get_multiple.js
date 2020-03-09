const mongoose = require('mongoose');
const logger = require('../utils/logger');
const Request = require('../models/request');

module.exports = function (userId, ids) {
    logger.info('Getting multiple requests... : ' + userId);
    logger.debug(ids);
    if (!ids) {
        logger.warn("request id list is not provided");
        return Promise.reject("empty-data");
    }
    ids = ids.map(id => mongoose.Types.ObjectId(id));

    return Request.aggregate([{
        "$match": {
            _id: {"$in": ids},
            deleted: false,
            banned: false,
            status: {"$ne": "draft"},
            archived: false,
        }
    }, {
        $sort: {
            modifiedOn: -1
        }
    }, {
        "$lookup": {
            from: "profiles",
            localField: "createdBy",
            foreignField: "_id",
            as: "creator"
        }
    }, {
        "$lookup": {
            from: "responses",
            as: "responseId",
            let: {req: "$_id"},
            pipeline: [{
                $match: {
                    deleted: false,
                    createdBy: userId,
                    $expr: {
                        $eq: [{$toString: "$requestId"}, {$toString: "$$req"}]
                    }
                }
            }, {
                $project: {
                    _id: {$toString: "$_id"},
                }
            }]
        }
    }, {
        "$lookup":
            {
                from: "promotions",
                let: {id: "$_id"},
                pipeline: [{
                    $match: {
                        deleted: false,
                        $expr: {
                            $eq: [{$toString: "$to"}, {$toString: "$$id"}]
                        },
                        from: userId
                    }
                }],
                as: "promotions"
            }
    }, {
        $project: {
            _id: {$toString: "$_id"},
            post: 1,
            location: 1,
            locationSet: 1,
            responseId: {
                $arrayElemAt: [{
                    $cond: {
                        if: {$eq: [{$size: "$responseId"}, 1]},
                        then: "$responseId._id",
                        else: [null]
                    }
                }, 0]
            },
            promoted: {$toBool: {$size: "$promotions"}},
            startTime: 1,
            endTime: 1,
            createdOn: 1,
            modifiedOn: 1,
            createdBy: 1,
            sos: 1,
            currency: 1,
            money: 1,
            requesterRating: 1,
            requesterComment: 1,
            status: 1,
            photos: 1,
            creator: 1,
            locationName: 1,
            boostedTill: 1,
            boosted: 1,
        }
    }])
        .exec()
        .then(results => {
            let requests = [];
            let profiles = {};
            results.forEach(result => {
                result._id = mongoose.Types.ObjectId(result._id).toString();
                let profile = result.creator[0];
                if (!requests.some(request => request._id === result._id)) {
                    let request = result;//.toJSON();
                    delete request.creator;
                    requests.push(request);
                }
                profiles[profile._id] = {
                    _id: profile._id,
                    modifiedOn: profile.modifiedOn,
                    heroName: profile.heroName,
                    profilePic: profile.profilePic,
                };
            });
            return {requests: requests, profiles: profiles};
        })
        .then(results => {
            logger.info("multiple requests read");
            return {code: 200, results: results};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};