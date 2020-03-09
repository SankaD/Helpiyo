const moment = require('moment');
const logger = require('../utils/logger');
const Request = require('../models/request');

module.exports = () => {
    logger.info("archiving requests");

    const now = moment().utc().toDate();
    const time = moment().utc().subtract(7, "days").toDate();
    return Request.updateMany({
        archived: false,
        status: "completed",
        modifiedOn: {$lt: time}
    }, {
        archived: true,
        modifiedOn: now,
    })
        .exec()
        .then((result) => {
            logger.info("archiving finished");
            logger.info(result);
        });
};
