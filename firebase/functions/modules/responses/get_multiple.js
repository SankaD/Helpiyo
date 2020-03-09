const logger = require('../utils/logger');
const Response = require('../models/response');
const mongoose = require('mongoose');

module.exports = function (userId, responseIds) {
    logger.info("Getting multiple responses: " + userId);
    logger.debug(arguments);
    // const responseIds = entries.map(entry => entry._id);
    let ids = responseIds.map(id => mongoose.Types.ObjectId(id));

    return Response.aggregate([
        {
            "$match": {
                _id: {"$in": ids},
                status: {"$ne": "draft"},
                deleted: false,
                banned: false,
            }
        },
        {
            "$lookup": {
                from: "profiles",
                localField: "createdBy",
                foreignField: "_id",
                as: "creator"
            }
        }
    ])
        .exec()
        .then(results => {
            let responses = [];
            let profiles = {};
            results.forEach(result => {
                result._id = mongoose.Types.ObjectId(result._id).toString();
                result.requestId = mongoose.Types.ObjectId(result.requestId).toString();
                let profile = result.creator[0];
                if (!responses.some(response => response._id === result._id)) {
                    let response = Object.assign({}, result);
                    response._id = result._id;
                    delete response.creator;
                    responses.push(response);
                }
                profiles[profile._id] = {
                    _id: profile._id,
                    modifiedOn: profile.modifiedOn,
                    heroName: profile.heroName,
                    profilePic: profile.profilePic,
                };
            });
            return {responses: responses, profiles: profiles};
        })
        .then(results => {
            logger.info("retrieved response count : " + results.responses.length);
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