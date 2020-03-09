const logger = require('../utils/logger');
const moment = require('moment');
const Promotion = require('../models/service_promotion');
const Service = require('../models/service');
const addPoints = require('../utils/add_points');

module.exports = (userId, serviceId) => {
    logger.info("promoting service : " + serviceId + " by :" + userId);

    let now = moment().utc().toDate();

    return Service.findOne({_id: serviceId, status: "active", deleted: false, banned: false}).exec()
        .then(request => {
            if (!request) {
                throw "active-request-not-found";
            }
            return Promotion.findOne({from: userId, to: serviceId, deleted: false}).exec();
        })
        .then((result) => {
            if (result) {
                return result.updateOne({deleted: true, modifiedOn: now}).exec()
                    .then(() => {
                        return addPoints(userId, "demote-service", serviceId);
                    })
                    .then(() => {
                        return false;
                    });
            }
            let promo = new Promotion({
                from: userId,
                to: serviceId,
                createdOn: now,
                modifiedOn: now,
                deleted: false,
            });
            return promo.save()
                .then(() => {
                    return addPoints(userId, "promote-service", serviceId);
                })
                .then(() => {
                    return true;
                });
        })
        .then((result) => {
            logger.info("service promoted");
            return {code: 200, promoted: result};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};