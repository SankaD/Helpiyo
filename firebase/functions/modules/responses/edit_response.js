const moment = require("moment");
const Response = require('../models/response');
const logger = require('../utils/logger');

module.exports = (userId, data) => {
    logger.info("editing response : " + data._id);

    return Response.findOne({_id: data._id, createdBy: userId, status: "active", deleted: false, banned: false}).exec()
        .then(response => {
            return response.updateOne({
                post: data.post,
                location: data.location,
                startTime: data.startTime,
                endTime: data.endTime,
                money: data.money,
                currency: data.currency,
                modifiedOn: moment().utc().toDate(),
                photos: data.photos,
            }).exec();
        })
        .then(() => {
            logger.info("successfully edited response");
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