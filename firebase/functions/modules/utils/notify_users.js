const admin = require('firebase-admin');
const logger = require('./logger');
const Profile = require('../models/profile');

module.exports = (profileIds, payloadType, payload, targetId) => {
    logger.info("notifying profiles : " + payload + ":" + payloadType + " : " + targetId);

    return Profile.aggregate([
        {
            "$match": {
                _id: {"$in": profileIds},
                status: "active",
                banned: false,
                deactivated: false
            }
        }, {
            "$lookup": {
                from: "devices",
                localField: "_id",
                foreignField: "usedBy",
                as: "device"
            }
        }, {
            "$project": {
                device: 1
            }
        }
    ])
        .then(profiles => {
            return profiles.map(profile => profile.device[0]);
        })
        .then(devices => {
            logger.info("devices retrieved. count : " + devices.length);
            return devices.map(d => d ? d.token : "");
        })
        .then(tokens => {
            logger.info("tokens retrieved. count : " + tokens.length);
            let promises = tokens.map(token => {
                if (typeof global.it === 'function' || !token || token === "") {
                    return Promise.resolve();
                }
                const notification = {
                    notification: {
                        title: payloadType,
                        body: payload,
                    },
                    android: {
                        collapseKey: payloadType,
                        priority: "normal",
                        ttl: 7 * 24 * 3600 * 1000,
                        notification: {
                            title: payloadType,
                            body: payload,
                            tag: targetId,
                        },
                        restrictedPackageName: "me.helpiyo.app"
                    },
                    apns: {
                        headers: {
                            'apns-priority': '10',
                            "apns-topic": "me.helpiyo.ios",
                            "apns-expiration": `${7 * 24 * 3600}`,
                            "apns-collapse-id": payloadType,
                        },
                        payload: {
                            aps: {
                                alert: {
                                    title: payloadType,
                                    body: payload,
                                }
                            }
                        }
                    },
                    token: token
                };
                return admin.messaging().send(notification)
                    .catch(error => {
                        logger.warn(error);
                    });
            });
            return Promise.all(promises);
        })
        .then(() => {
            logger.info("profiles notified");
        });
};