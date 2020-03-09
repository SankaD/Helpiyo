const logger = require('../utils/logger');
const getMultipleRequests = require('../requests/get_multiple');
const getMultipleServices = require('../service/get_multiple');
const Profile = require('../models/profile');
const Request = require('../models/request');
const Service = require('../models/service');

module.exports = (userId, text, count, searchType) => {
    logger.info("searching for : " + text + " by : " + userId + " : " + searchType);

    const results = {
        profiles: [],
        requests: [],
        services: []
    };

    const regex = ".*" + text.trim().replace(" ", ".*") + ".*";
    logger.info("regex = " + regex);

    let promises = [
        Promise.resolve().then(() => {
            if (searchType !== "global" && searchType !== "profile") {
                return [];
            }
            return Profile.find({status: "active", heroName: {"$regex": regex, "$options": "i"}})
                .limit(count)
                .exec();
        })
            .then(profiles => {
                if (profiles.length === 0) {
                    return {results: []};
                }
                return {
                    results: profiles.map(p => ({
                        _id: p._id,
                        heroName: p.heroName,
                        ranking: p.ranking,
                        classRanking: p.classRanking,
                        rating: p.rating,
                        modifiedOn: p.modifiedOn,
                        profilePic: p.profilePic
                    }))
                };
                // return getMultipleProfiles(userId, profileIds);
            })
            .then(profiles => {
                results.profiles = profiles.results;
            }),
        Promise.resolve().then(() => {
            if (searchType !== "global" && searchType !== "request") {
                return [];
            }
            return Request.find({
                status: "active",
                deleted: false,
                archived: false,
                post: {"$regex": regex, "$options": "i"}
            })
                .limit(count)
                .exec();
        })
            .then(rs => rs.map(r => r._id.toString()))
            .then(requestIds => {
                if (requestIds.length === 0) {
                    return {results: {requests: [], profiles: {}}};
                }
                return getMultipleRequests(userId, requestIds);
            })
            .then(requests => {
                results.requests = requests.results;
            }),
        Promise.resolve().then(() => {
            if (searchType !== "global" && searchType !== "service") {
                return [];
            }
            return Service.find({
                status: "active",
                deleted: {$ne: true},
                post: {"$regex": regex, "$options": "i"}
            })
                .limit(count)
                .exec();
        })
            .then(rs => rs.map(r => r._id.toString()))
            .then(serviceIds => {
                if (serviceIds.length === 0) {
                    return {results: {services: [], profiles: {}}};
                }
                return getMultipleServices(userId, serviceIds);
            })
            .then(result => {
                results.services = result.results;
            })];

    return Promise.all(promises)
        .then(() => {
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