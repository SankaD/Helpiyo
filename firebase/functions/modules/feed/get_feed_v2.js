const mongoose = require('mongoose');
const logger = require('../utils/logger');
const moment = require('moment');
const getMultipleRequests = require('../requests/get_multiple');
const getMultipleServices = require('../service/get_multiple');
const updateLocation = require('../profile/update_location');
const Request = require('../models/request');
const Service = require('../models/service');
const ServicePromotion = require('../models/service_promotion');
const Profile = require('../models/profile');
const Following = require('../models/follows');

function sortFeed(requestsResults, servicesResult, latitude, longitude, interests) {
    logger.info("sorting feed");
    const now = moment().utc().toDate().getTime();

    let profiles = combineProfiles(requestsResults.profiles, servicesResult.profiles);

    let requests = requestsResults.requests;
    let services = servicesResult.services;

    requests = requests.map((request) => {
        request.creator = profiles[request.createdBy];
        return request;
    });

    services = services.map(service => {
        service.creator = profiles[service.createdBy];
        return service;
    });

    requests = requests.map((element, index) => {
        let timeMarks = 100 - ((now - Date.parse(element.createdOn)) / (24 * 3600 * 1000));// consider time
        let sosMarks = element.sos ? 10 : 0; // consider sos
        let profileMarks = (element.creator.rating || 5) * 5; // consider creator
        let locationMarks = 10;
        if (element.locationSet) {
            const y = (element.location.coordinates[0] - longitude);
            const x = (element.location.coordinates[1] - latitude);
            const points = ((y * y) + (x * x)) * 1000;
            locationMarks = Math.max((25 - points), 0); // consider location
        }
        let interestMarks = 0;
        interests.some(i => {
            if (element.post.toLowerCase().includes(i.toLowerCase())) {
                interestMarks = 200;
                return true;
            }
            return false;
        });
        logger.debug(element.post);
        // logger.info(interests);
        // logger.info(interestMarks);

        let boostMarks = element.boosted ? 40 : 0;
        let marks = timeMarks + sosMarks + profileMarks + locationMarks + boostMarks + interestMarks;

        logger.debug(`${timeMarks}\t\t${sosMarks}\t\t${profileMarks}\t\t${locationMarks}\t\t${boostMarks}\t\t${marks}`);
        return {element, marks};
    })
        .sort((a, b) => {
            if (a.marks < b.marks) {
                return 1;
            } else if (a.marks > b.marks) {
                return -1;
            }
            if (a.createdOn > b.createdOn) {
                return -1;
            } else if (a.createdOn < b.createdOn) {
                return 1;
            }
            return 0;
        })
        .map(item => {
            delete item.element.creator;
            return item.element;
        });

    services = services.map((element, index) => {
        let timeMarks = 100 - ((now - Date.parse(element.createdOn)) / (24 * 3600 * 1000));// consider time
        let profileMarks = (element.creator.rating || 5) * 5; // consider creator
        let locationMarks = 10;
        if (element.locationSet) {
            const y = (element.location.coordinates[0] - longitude);
            const x = (element.location.coordinates[1] - latitude);
            const points = ((y * y) + (x * x)) * 1000;
            locationMarks = Math.max((25 - points), 0); // consider location
        }
        let interestMarks = 0;
        interests.some(i => {
            if (element.post.toLowerCase().includes(i.toLowerCase())) {
                interestMarks = 200;
                return true;
            }
            return false;
        });
        logger.debug(element.post);

        let boostMarks = element.boosted ? 40 : 0;
        let marks = timeMarks + profileMarks + locationMarks + boostMarks + interestMarks;

        logger.debug(`${timeMarks}\t\t${profileMarks}\t\t${locationMarks}\t\t${boostMarks}\t\t${marks}`);
        return {element, marks};

    })
        .sort((a, b) => {
            if (a.marks < b.marks) {
                return 1;
            } else if (a.marks > b.marks) {
                return -1;
            }
            if (a.createdOn > b.createdOn) {
                return -1;
            } else if (a.createdOn < b.createdOn) {
                return 1;
            }
            return 0;
        })
        .map(item => {
            delete item.element.creator;
            return item.element;
        });
    return {services: services, requests: requests, profiles: profiles};
}

function getServices(userId, latitude, longitude, interests) {
    let promises = [];
    let serviceIds = new Set();

    let promise = Service.aggregate()
        .near({
            near: [longitude, latitude],
            maxDistance: 1000000,
            distanceField: "location",
            spherical: true,
            query: {status: "active", deleted: false, banned: false, locationSet: true}
        }, "_id")
        .limit(1000)
        .exec()
        .then(rs => {
            logger.info("services from location : " + rs.length);
            rs.forEach(r => {
                serviceIds.add(r._id);
            });
        });
    promises.push(promise);

    promise = Service.find({
        status: "active",
        deleted: false,
        post: {$regex: getRegex(interests), $options: "i"}
    })
        .sort({modifiedOn: -1})
        .limit(500)
        .select("_id")
        .exec()
        .then(rs => {
            logger.info("services from interests: " + rs.length);
            rs.forEach(r => {
                serviceIds.add(r._id);
            });
        });
    promises.push(promise);

    promise = Following.find({
        from: userId,
        deleted: false,
    }, "to")
        .exec()
        .then(followings => followings.map(f => f.to))
        .then(ids => {
            logger.info("following users count : " + ids.length);
            return Service.find({createdBy: {"$in": ids}, status: "active", locationSet: false})
                .sort({modifiedOn: -1})
                .limit(100)
                .select("_id")
                .exec();
        })
        .then(rs => {
            logger.info("services from following : " + rs.length);
            rs.forEach(r => {
                serviceIds.add(r._id);
            });
        });
    promises.push(promise);

    promise = Service.find({
        status: "active",
        locationSet: false,
        deleted: false,

    })
        .sort({modifiedOn: -1})
        .limit(500)
        .select("_id")
        .exec()
        .then(rs => {
            logger.info("feed from location less services : " + rs.length);
            rs.forEach(r => {
                serviceIds.add(r._id);
            });
        });
    promises.push(promise);

    return Promise.all(promises)
        .then(() => {
            let ids = [...serviceIds];
            let objectIds = ids.map(id => mongoose.Types.ObjectId(id));
            return Service.find({_id: {"$in": objectIds}, status: "active"})
                .sort({modifiedOn: -1})
                .limit(500)
                .select("_id")
                .exec();
        })
        .then(rs => rs.map(r => r._id.toString()))
        .then((ids) => {
            logger.info("services found. getting instances : " + ids.length);
            return getMultipleServices(userId, ids);
        });
}

function getRequests(userId, latitude, longitude, interests) {
    let promises = [];
    let requestIds = new Set();

    // nearby requests
    let promise = Request.aggregate()
        .near({
            near: [longitude, latitude],
            maxDistance: 1000000,
            distanceField: "location",
            spherical: true,
            query: {status: "active", serviceId: null, deleted: false, banned: false, locationSet: true}
        }, "_id")
        .limit(1000)
        // .project("_id")
        .exec()
        .then(rs => {
            logger.info("requests from location : " + rs.length);
            rs.forEach(r => {
                requestIds.add(r._id);
            });
        });
    promises.push(promise);

    // find requests by interests
    promise = Request.find({
        status: "active",
        deleted: false,
        post: {$regex: getRegex(interests), $options: "i"}
    })
        .sort({modifiedOn: -1})
        .limit(500)
        .select("_id")
        .exec()
        .then(rs => {
            logger.info("requests from interests: " + rs.length);
            rs.forEach(r => {
                requestIds.add(r._id);
            });
        });
    promises.push(promise);

    // requests by following users
    promise = Following.find({
        from: userId,
        deleted: false,
    }, "to")
        .exec()
        .then(followings => followings.map(f => f.to))
        .then(ids => {
            logger.info("following users count : " + ids.length);
            return Request.find({createdBy: {"$in": ids}, serviceId: null, status: "active", locationSet: false})
                .sort({modifiedOn: -1})
                .limit(100)
                .select("_id")
                .exec();
        })
        .then(rs => {
            logger.info("requests from following : " + rs.length);
            rs.forEach(r => {
                requestIds.add(r._id);
            });
        });
    promises.push(promise);

    // requests promoted by following users
    promise = Following.aggregate([
        {
            $match: {
                $expr: {
                    $eq: [{$toString: "$from"}, {$toString: userId}]
                },
                deleted: false
            }
        }, {
            $lookup: {
                from: "promotions",
                let: {
                    proId: "$to"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [{$toString: "$from"}, {$toString: "$$proId"}]
                            }
                        }
                    }, {
                        $project: {
                            to: 1
                        }
                    }
                ],
                as: "promotions"
            }
        }, {
            $project: {
                "promotions.to": 1
            }
        }
    ])
        .limit(200)
        .exec()
        .then(results => {
            results.forEach(result => {
                result.promotions.forEach(element => {
                    requestIds.add(mongoose.Types.ObjectId(element.to).toString());
                });
            });
        });
    promises.push(promise);


    // requests without location
    promise = Request.find({
        status: "active",
        locationSet: false,
        serviceId: null,
        deleted: false,

    })
        .sort({modifiedOn: -1})
        .limit(500)
        .select("_id")
        .exec()
        .then(rs => {
            logger.info("feed from location less requests : " + rs.length);
            rs.forEach(r => {
                requestIds.add(r._id);
            });
        });
    promises.push(promise);

    return Promise.all(promises)
        .then(() => {
            let ids = [...requestIds];
            let objectIds = ids.map(id => mongoose.Types.ObjectId(id));
            return Request.find({_id: {"$in": objectIds}, status: "active", serviceId: null})
                .sort({modifiedOn: -1})
                .limit(500)
                .select("_id")
                .exec();
        })
        .then(rs => rs.map(r => r._id.toString()))
        .then((ids) => {
            logger.info("requests found. getting instances : " + ids.length);
            return getMultipleRequests(userId, ids);
        });
}

function getRegex(interests) {
    let filter = ".*[";
    interests.forEach((i, index) => {
        filter += (index !== 0 ? "|" : "") + i;
    });
    filter += "].*";
    return new RegExp(filter, "i");
}

function combineProfiles(profiles1, profiles2) {
    return Object.assign({}, profiles1, profiles2);
    // return [...profiles1, ...profiles2];
}

module.exports = function (userId, latitude, longitude) {
    logger.info("getting feed for user : " + userId);

    if (latitude === null || longitude === null) {
        return Promise.resolve()
            .then(() => {
                throw "validation-failure";
            });
    }
    let interests = [];
    let requestResults;
    let serviceResults;


    return Profile.findById(userId).exec()
        .then(profile => {
            if (!profile) {
                throw "profile-not-found";
            }
            interests = profile.interests;
            if (interests.length === 0) {
                return [];
            }
            return interests;
        })
        .then(() => {
            let promises = [];

            let promise = getRequests(userId, latitude, longitude, interests)
                .then(results => {
                    requestResults = results;
                });
            promises.push(promise);

            promise = getServices(userId, latitude, longitude, interests)
                .then(results => {
                    serviceResults = results;
                });
            promises.push(promise);

            return Promise.all(promises);
        })
        .then(() => {
            logger.info("feed generated. request count : " + requestResults.results.requests.length + ", service count : " + serviceResults.results.services.length);
            let results = sortFeed(requestResults.results, serviceResults.results, latitude, longitude, interests);
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