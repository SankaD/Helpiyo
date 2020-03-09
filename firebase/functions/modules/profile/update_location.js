const Logger = require('../utils/logger');
const moment = require('moment');
const Device = require('../models/device');

module.exports = (userId, deviceToken, latitude, longitude) => {
    Logger.info("updating location for :" + userId);

    return Device.findOne({token: deviceToken, usedBy: userId, deleted: false}).exec()
        .then(device => {
            if (!device) {
                throw "device-not-found";
            }
            return device.updateOne({
                location: {type: "Point", coordinates: [longitude, latitude]},
                modifiedOn: moment().utc().toDate(),
            }).exec();
        })
        .then(() => {
            Logger.info("location updated");
            return {code: 200};
        })
        .catch(error => {
            Logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};