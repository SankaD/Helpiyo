const mongoose = require('mongoose');
const logger = require('../utils/logger');
const Service = require('../models/service');

module.exports = function (userId, ids) {
    logger.info('Getting multiple services... : ' + userId);
    logger.info(ids);
    if (!ids) {
        logger.warn("request id list is not provided");
        return Promise.reject("empty-data");
    }
    ids = ids.map(id => mongoose.Types.ObjectId(id));

    return Service.aggregate([{
        "$match": {
            _id: {"$in": ids},
            deleted: false,
            banned: false,
            // status: "active",
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
        "$lookup":
            {
                from: "servicepromotions",
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
            promoted: {$toBool: {$size: "$promotions"}},
            createdOn: 1,
            modifiedOn: 1,
            createdBy: 1,
            currency: 1,
            money: 1,
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
            let services = [];
            let profiles = {};
            logger.info(results);
            results.forEach(result => {
                result._id = mongoose.Types.ObjectId(result._id).toString();
                let profile = result.creator[0];
                if (!services.some(service => service._id === result._id)) {
                    let service = result;//.toJSON();
                    delete service.creator;
                    services.push(service);
                }
                profiles[profile._id] = {
                    _id: profile._id,
                    modifiedOn: profile.modifiedOn,
                    heroName: profile.heroName,
                    profilePic: profile.profilePic,
                };
            });
            return {services: services, profiles: profiles};
        })
        .then(results => {
            logger.info("multiple services read");
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