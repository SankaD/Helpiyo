const moment = require('moment');
const Point = require('../models/point');
const PointTable = require('../models/point_table');
const logger = require('./logger');

module.exports = (userId, type, target, additionalPoints) => {
    logger.info("adding points to: " + userId + " for " + target + " in " + type);

    let now = moment().utc().toDate();
    if (Boolean(additionalPoints) && additionalPoints < 0) {
        logger.error("additional points are negative : " + additionalPoints);
        return Promise.resolve();
    }

    return PointTable.findOne({type: type, status: "active"}).exec()
        .then(pointTable => {
            let value = pointTable.value;
            let point = new Point({
                profileId: userId,
                type: type,
                value: value,
                add: additionalPoints || 0,
                target: target,
                createdOn: now,
            });
            return point.save();
        })
        .then(() => {
            logger.info("points saved");
        })
        .catch(error => {
            logger.error(`point save failed : ${userId} | ${type} | ${target} | ${additionalPoints}`);
            logger.error(error);
        });
};