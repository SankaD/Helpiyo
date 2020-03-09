const logger = require('../utils/logger');
const Service = require('../models/service');
const getMultiple = require('./get_multiple');

module.exports = (userId, profileId) => {
    logger.info("getting services by : " + profileId);
    let statuses = (userId === profileId) ? ["active", "inactive"] : ["active"];
    return Service.find({
        createdBy: profileId,
        status: {$in: statuses}
    }).exec()
        .then(services => {
            let ids = services.map(s => s._id.toString());
            return getMultiple(userId, ids);
        })
        .then(results => {
            // logger.info("services received. count : " + results.services.length);
            return results;
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};