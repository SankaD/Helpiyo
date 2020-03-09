const moment = require('moment');
const Logger = require('../utils/logger');
const DbManager = require('../db/db_manager');
const Utils = require('../utils/index');

module.exports = (userId, phoneNumber) => {
    Logger.info("requesting phone number change");
    // todo : send verification

    const verificationCode = Utils.instance.generateRandomCode();

    const profiles = DbManager.db.collection("Profile");
    return profiles.update(userId, {
        phoneCode: verificationCode,
        newPhoneNumber: phoneNumber,
        newNumberSetAt: moment().utc().toDate(),
    })
        .then(result => {
            Logger.info("verification code generated");
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