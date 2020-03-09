const mongoose = require('mongoose');
const logger = require('../utils/logger');
const MessageThread = require('../models/message_thread');

module.exports = (userId, threadIds) => {
    logger.info("getting multiple threads");
    logger.debug(threadIds);
    let ids = threadIds.map(id => mongoose.Types.ObjectId(id));
    return MessageThread.aggregate([{
        "$match": {
            _id: {"$in": ids},
            banned: false,
        }
    }, {
        "$lookup": {
            from: "profiles",
            localField: "participants",
            foreignField: "_id",
            as: "participantsInstances"
        }
    }, {
        "$project": {
            _id: {
                "$toString": "$_id"
            },
            participants: 1,
            createdOn: 1,
            modifiedOn: 1,
            createdBy: 1,
            participantsInstances: 1
        }
    }, {
        $sort: {
            modifiedOn: -1
        }
    }])
        .exec()
        .then(results => {
            let threads = [];
            let profiles = {};
            results.forEach(result => {
                result.participantsInstances.forEach(profile => {
                    profiles[profile._id] = {
                        _id: profile._id,
                        modifiedOn: profile.modifiedOn,
                        heroName: profile.heroName,
                        profilePic: profile.profilePic,
                    };
                });
                let thread = Object.assign({}, result);
                delete thread.participantsInstances;
                threads.push(thread);
            });
            return {threads: threads, profiles: profiles};
        })
        .then(results => {
            logger.info("threads received : " + results.threads.length);
            return {
                code: 200,
                results: results
            };
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });


};