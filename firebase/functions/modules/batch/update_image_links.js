const moment = require('moment');
const logger = require('../utils/logger');
const Profile = require('../models/profile');
const Request = require('../models/request');
const Response = require('../models/response');
const Service = require('../models/service');
const updateImages = require('../common/update_images');

module.exports = () => {
    logger.info("updating image links");
    let promises = [];
    const time = moment().add(-5, "days").utc().toDate();

    // updating profiles
    let promise = Profile.find({
        $or: [{imageRefreshedOn: {$lt: time}}, {imageRefreshedOn: {$eq: null}}],
        status: "active",
        banned: false
    }).exec()
        .then(profiles => {
            return profiles.map(profile => {
                return updateImages("system", "Profile", profile._id)
                    .catch(error => {
                        logger.warn(error);
                    });
            });
        })
        .then(promises => {
            return Promise.all(promises);
        })
        .then(() => {
            logger.info("updated profile images");
        });
    promises.push(promise);

    // updating requests
    promise = Request.find({
        $or: [{imageRefreshedOn: {$lt: time}}, {imageRefreshedOn: {$eq: null}}],
        status: {$ne: "draft"},
        archived: false,
        banned: false,
        deleted: false
    }).exec()
        .then(requests => {
            return requests.map(request => {
                return updateImages("system", "Request", request._id.toString())
                    .catch(error => {
                        logger.warn(error);
                    });
            });
        })
        .then(promises => {
            return Promise.all(promises);
        })
        .then(() => {
            logger.info("updated Request images");
        });
    promises.push(promise);

    // updating responses
    promise = Response.find({
        $or: [{imageRefreshedOn: {$lt: time}}, {imageRefreshedOn: {$eq: null}}],
        status: {$ne: "draft"},
        archived: false,
        banned: false,
        deleted: false
    }).exec()
        .then(responses => {
            return responses.map(response => {
                return updateImages("system", "Response", response._id.toString())
                    .catch(error => {
                        logger.warn(error);
                    });
            });
        })
        .then(promises => {
            return Promise.all(promises);
        })
        .then(() => {
            logger.info("updated Response images");
        });
    promises.push(promise);

    // updating services
    promise = Service.find({
        $or: [{imageRefreshedOn: {$lt: time}}, {imageRefreshedOn: {$eq: null}}],
        status: {$ne: "draft"},
        banned: false,
        deleted: false
    }).exec()
        .then(services => {
            return services.map(service => {
                return updateImages("system", "Service", service._id.toString())
                    .catch(error => {
                        logger.warn(error);
                    });
            });
        })
        .then(promises => {
            return Promise.all(promises);
        })
        .then(() => {
            logger.info("updated Service images");
        });
    promises.push(promise);

    return Promise.all(promises)
        .then(() => {
            logger.info("updated image links");
        });
};