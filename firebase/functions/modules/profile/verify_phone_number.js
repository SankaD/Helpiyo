// const Logger = require('../utils/logger');
// const DbManager = require('../db/db_manager');
// const moment = require('moment');
//
// module.exports = (userId, phoneNumber, verificationCode) => {
//     Logger.info("verifying phone number");
//
//     const profiles = DbManager.db.collection("Profile");
//     return profiles.document(userId)
//         .catch(error => {
//             Logger.error("couldn't get the profile");
//             Logger.error(error);
//             throw "db-error";
//         })
//         .then((profile) => {
//             if (profile.phoneCode !== verificationCode) {
//                 throw "code-mismatch";
//             }
//             // todo : phone number and changed time needs to checked here.
//             return profiles.update(userId, {
//                 phoneNumber: phoneNumber,
//                 phoneCode: "",
//                 newPhoneNumber: null,
//                 newNumberSetAt: moment().utc().toDate(),
//                 modifiedOn: moment().utc().toDate()
//             })
//                 .catch(error => {
//                     Logger.error("couldn't update the profile");
//                     Logger.error(error);
//                     throw "db-error";
//                 });
//         })
//         .then(() => {
//             Logger.info("Phone number saved");
//             return {code: 200};
//         })
//         .catch(error => {
//             Logger.error(error);
//             throw error;
//         });
// };