const logger = require('../utils/logger');
const moment = require('moment');
const Promotion = require('../models/promotion');
const Request = require('../models/request');
const addPoints = require('../utils/add_points');

module.exports = (userId, requestId) => {
    logger.info("promoting request : " + requestId + " by :" + userId);

    let now = moment().utc().toDate();

    return Request.findOne({_id: requestId, status: "active", deleted: false, banned: false}).exec()
        .then(request => {
            if (!request) {
                throw "active-request-not-found";
            }
            return Promotion.findOne({from: userId, to: requestId, deleted: false}).exec();
        })
        .then((result) => {
            if (result) {
                return result.updateOne({deleted: true, modifiedOn: now}).exec()
                    .then(() => {
                        return addPoints(userId, "demote-request", requestId);
                    })
                    .then(() => {
                        return false;
                    });
            }
            let promo = new Promotion({
                from: userId,
                to: requestId,
                createdOn: now,
                modifiedOn: now,
                deleted: false,
            });
            return promo.save()
                .then(() => {
                    return addPoints(userId, "promote-request", requestId);
                })
                .then(() => {
                    return true;
                });
        })
        .then((result) => {
            logger.info("request promoted");
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