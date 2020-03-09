// const DbManager = require('../db/db_manager');
// const logger = require('../utils/logger');
//
// module.exports = function (userId, emailCode, phoneCode) {
//     logger.info('Verifying user : ' + userId);
//
//     const db = DbManager.db;
//     const profiles = db.collection("Profile");
//
//     return profiles.document(userId)
//         .then(profile => {
//             if (!profile) {
//                 logger.warn("profile not found");
//                 throw "profile-not-found";
//             }
//             if (profile.status !== "new") {
//                 logger.warn("profile status is : " + profile.status);
//                 throw "profile-not-new";
//             }
//             if (!emailCode) {
//                 throw "email-code-required";
//             }
//             if (!phoneCode) {
//                 throw "phone-code-required";
//             }
//             if (profile.emailCode !== emailCode) {
//                 throw "invalid-email-code";
//             }
//             if (profile.phoneCode !== phoneCode) {
//                 throw "invalid-phone-code";
//             }
//             profile.status = "active";
//             profile.emailCode = undefined;
//             profile.phoneCode = undefined;
//
//             return profiles.update(profile._id, profile, {});
//         })
//         .then(() => {
//             return profiles.document(userId);
//         })
//         .then(result => {
//             logger.info("successfully verified profile");
//             return {
//                 code: 200,
//                 profile: result
//             };
//         });
// };