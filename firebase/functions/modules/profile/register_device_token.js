const Joi = require('joi');
const DbManager = require('../db/db_manager');
const logger = require('../utils/logger');
const moment = require('moment');
const Device = require('../models/device');

module.exports = (userId, token, deviceId) => {
    logger.info("registering device token for : " + userId + " for device : " + deviceId);

    return Device.updateMany({token: token}, {token: ""}).exec()
        .then(() => {
            return Device.findById(deviceId).exec();
        })
        .then(device => {
            if (device) {
                return device.updateOne({
                    token: token,
                    usedBy: userId,
                    modifiedOn: moment().utc().toDate(),
                }).exec();
            }
            const newDevice = new Device({
                _id: deviceId,
                token: token,
                createdBy: userId,
                usedBy: userId,
                createdOn: moment().utc().toDate(),
                modifiedOn: moment().utc().toDate(),
            });
            return newDevice.save();
        })
        .then(() => {
            logger.info("token registered for user : " + userId);
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