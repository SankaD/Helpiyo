const moment = require('moment');
const logger = require('../utils/logger');
const addPoints = require('../utils/add_points');

module.exports = (userId, referrer) => {
    logger.info("handling invitation : " + userId + " : " + referrer);

    if (!referrer) {
        return Promise.resolve();
    }
    return addPoints(referrer, "invites", userId)
        .then(() => {
            return addPoints(userId, "invited", referrer);
        })
        .then(() => {
            logger.info("invitation handled. points updated");
        })
        .catch(error => {
            logger.error(error);
        });
};