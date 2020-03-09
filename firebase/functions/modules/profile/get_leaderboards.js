const Logger = require('../utils/logger');
const Profile = require('../models/profile');
const follows = require('../models/follows');

module.exports = (userId, offset, name) => {
    Logger.info("getting leaderboards : " + offset + " : " + name);

    if (name === "global") {
        return Profile.find({status: "active", banned: false, deactivated: false})
            .sort({
                ranking: 1,
                createdOn: 1
            })
            .skip(offset)
            .limit(20)
            .exec()
            .then(rs => rs.map(r => r._id))
            .then(ids => {
                ids.push(userId);
                return Profile.find({banned: false, deactivated: false, _id: {"$in": ids}})
                    .sort({
                        ranking: 1,
                        createdOn: 1
                    })
                    .skip(offset)
                    // .limit(20)
                    .exec();
            })
            .then(profiles => {
                return profiles.map(profile => {
                    return {
                        _id: profile._id.toString(),
                        modifiedOn: profile.modifiedOn,
                        heroName: profile.heroName,
                        points: profile.absolutePoints,
                        ranking: profile.ranking || "NA",
                        profilePic: profile.profilePic,
                        rating: profile.rating,
                    };
                });
            })
            .then(results => {
                Logger.info("results received : " + results.length);
                return {leaderboard: results, code: 200};
            })
            .catch(error => {
                Logger.error("couldn't get global leaderboard");
                Logger.error(error);
                if (typeof error === typeof "") {
                    throw error;
                }
                throw "db-error";
            });
    } else if (name === "local") {
        return follows.find({
            from: userId,
            deleted: false
        }, "to")
            .exec()
            .then(rs => rs.map(r => r.to))
            .then(ids => {
                ids.push(userId);
                return Profile.find({banned: false, deactivated: false, _id: {"$in": ids}})
                    .sort({
                        ranking: 1,
                        createdOn: 1
                    })
                    .skip(offset)
                    .limit(20)
                    .exec();
            })
            .then(profiles => {
                return profiles.map(profile => {
                    return {
                        _id: profile._id.toString(),
                        modifiedOn: profile.modifiedOn,
                        heroName: profile.heroName,
                        points: profile.absolutePoints,
                        ranking: profile.ranking || "NA",
                        profilePic: profile.profilePic
                    };
                });
            })
            .then(results => {
                Logger.info("results received : " + results.length);
                return {leaderboard: results, code: 200};
            })
            .catch(error => {
                Logger.error("couldn't get local leaderboard");
                Logger.error(error);
                if (typeof error === typeof "") {
                    throw error;
                }
                throw "db-error";
            });
    }
    return Promise.reject("unknown-type");
};