const moment = require('moment');
const logger = require('../utils/logger');
const Request = require('../models/request');
const completeRequest = require('../requests/complete_request');

module.exports = () => {
    logger.info("completing old sos");

    let now = moment().add(-7, "days").utc().toDate();

    return Request.find({sos: true, createdOn: {$lt: now}, status: "active", deleted: false, banned: false}).exec()
        .then(requests => {
            return requests.map(request => {
                return completeRequest(request.createdBy, request._id.toString(), 5, "completed-by-system");
            });
        })
        .then(() => {
            logger.info("old sos requests completed");
        })
        .catch(error => {
            logger.error(error);
        });
};