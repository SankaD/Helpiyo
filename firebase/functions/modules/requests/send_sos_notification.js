const Logger = require('../utils/logger');
const DbManager = require('../db/db_manager');
const firebase = require('firebase-admin');
const Device = require('../models/device');

module.exports = (request) => {
    Logger.info("sending sos notification");

    const latitude = request.location.coordinates[1];
    const longitude = request.location.coordinates[0];

    return Device.aggregate()
        .near({
            near: [longitude, latitude],
            distanceField: "location",
            maxDistance: 5000,
            spherical: true,
            query: {deleted: false, token: {"$ne": ""}}
        })
        .limit(200)
        .exec()
        .then(devices => {
            Logger.info("sending notifications to : " + devices.length + " devices");
            let promises = devices.map(device => {
                Logger.debug("sending notification to device : " + device._id);
                if (!device.token) {
                    Logger.warn("device token not found");
                    return Promise.resolve();
                }
                const notification = {
                    notification: {
                        title: "SOS",
                        body: "SOS notification near you",
                    },
                    android: {
                        collapseKey: "SOS",
                        priority: "high",
                        ttl: 24 * 3600 * 1000,
                        notification: {
                            title: "SOS",
                            body: "SOS notification near you",
                            tag: "SOS",
                        },
                        restrictedPackageName: "me.helpiyo.app"
                    },
                    token: device.token
                };
                Logger.debug(notification);
                if (typeof global.it === 'function') {
                    return Promise.resolve();
                }
                return firebase.messaging().send(notification)
                    .then(response => {
                        Logger.debug("successfully sent the notification");
                        Logger.debug(response);
                    })
                    .catch(error => {
                        Logger.error(error);
                    });
            });
            return Promise.all(promises);
        })
        .then(() => {
            Logger.info("sos notifications sent");
        })
        .catch(error => {
            Logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};