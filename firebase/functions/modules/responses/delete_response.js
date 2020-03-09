const moment = require('moment');
const logger = require('../utils/logger');
const Response = require('../models/response');

module.exports = (userId, responseId) => {
    logger.info("deleting response : " + responseId + " by : " + userId);

    return Response.findOne({
        _id: responseId,
        createdBy: userId,
        deleted: false,
        status: "active"
    })
        .exec()
        .then(response => {
            if (!response) {
                throw "active-response-not-found";
            }
            return response.updateOne({deleted: true, modifiedOn: moment().utc().toDate()}).exec();
        })
        .then(() => {
            logger.info("successfully deleted response");
            return {code: 200};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};