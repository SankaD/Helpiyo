// const expect = require("chai").expect;
// const verifyProfile = require("../../modules/profile/verify_profile");
// const createProfile = require("../../modules/profile/register");
// const getProfile = require('../../modules/profile/get_profile');
// const DbManager = require('../../modules/db/db_manager');
// const Profile = require('../../modules/models/profile');
// const moment = require('moment');
//
// describe("verifying profile", () => {
//     describe("valid", () => {
//         it("verifying profile", () => {
//             const data = {
//                 email: "test_" + moment().utc().valueOf() + "@test.com",
//                 password: "Password@123",
//                 heroName: "verified12312",
//                 phoneNumber: "0125423234"
//             };
//             let user;
//             return createProfile(data)
//                 .then(() => {
//                     return DbManager.db.query("FOR profile in Profile filter profile.email==@email return profile", {email: data.email})
//                         .then(cursor => {
//                             return cursor.next();
//                         });
//                 })
//                 .then((user1) => {
//                     expect(user1).to.exist;
//                     expect(user1._id).to.exist;
//                     user = user1;
//                     return user;
//                 })
//                 .then((result) => {
//                     return verifyProfile(result._id, "000000", "000000")
//                         .catch((error) => {
//                             expect(error).to.not.exist;
//                         });
//                 })
//                 .then((result) => {
//                     expect(result).to.exist;
//                     expect(result.code).to.exist.and.to.equal(200);
//                     const profile = result.profile;
//                     expect(profile).to.exist;
//                     expect(profile.status).to.exist.and.to.equal("active");
//                     // expect(profile.emailCode).to.not.exist;
//                     // expect(profile.phoneCode).to.not.exist;
//                 });
//         });
//     });
//     describe("invalid", () => {
//         it("with email code wrong", () => {
//             return DbManager.db.query("FOR profile in Profile filter profile.email==@email return profile", {email: "new@test.com"})
//                 .then(cursor => {
//                     return cursor.next();
//                 })
//                 .then((user) => {
//                     expect(user).to.exist;
//                     expect(user._id).to.exist;
//
//                     return {userId: user._id, emailCode: "0000", phoneCode: "000000"};
//                 })
//                 .then((result) => {
//                     return verifyProfile(result.userId, result.emailCode, result.phoneCode)
//                         .catch((error) => {
//                             expect(error).to.exist.and.to.equal("invalid-email-code");
//                         });
//                 })
//                 .then((profile) => {
//                     expect(profile).to.not.exist;
//                 });
//         });
//         it("without email code", () => {
//             return DbManager.db.query("FOR profile in Profile filter profile.email==@email return profile", {email: "new@test.com"})
//                 .then(cursor => {
//                     return cursor.next();
//                 })
//                 .then((user) => {
//                     expect(user).to.exist;
//                     expect(user._id).to.exist;
//                     return {userId: user._id, emailCode: "0000", phoneCode: "000000"};
//                 })
//                 .then((result) => {
//                     return verifyProfile(result.userId, null, result.phoneCode)
//                         .catch((error) => {
//                             expect(error).to.exist.and.to.equal("email-code-required");
//                         });
//                 })
//                 .then((profile) => {
//                     expect(profile).to.not.exist;
//                 });
//         });
//         it("with wrong phone code", () => {
//             return DbManager.db.query("FOR profile in Profile filter profile.email==@email return profile", {email: "new@test.com"})
//                 .then(cursor => {
//                     return cursor.next();
//                 })
//                 .then((user) => {
//                     expect(user).to.exist;
//                     expect(user._id).to.exist;
//                     return {userId: user._id, emailCode: "000000", phoneCode: "0000"};
//                 })
//                 .then((result) => {
//                     return verifyProfile(result.userId, result.emailCode, result.phoneCode)
//                         .catch((error) => {
//                             expect(error).to.exist.and.to.equal("invalid-phone-code");
//                         });
//                 })
//                 .then((profile) => {
//                     expect(profile).to.not.exist;
//                 });
//         });
//         it("without phone code", () => {
//             return DbManager.db.query("FOR profile in Profile filter profile.email==@email return profile", {email: "new@test.com"})
//                 .then(cursor => {
//                     return cursor.next();
//                 })
//                 .then((user) => {
//                     expect(user).to.exist;
//                     expect(user._id).to.exist;
//                     return {userId: user._id, emailCode: "000000", phoneCode: "000000"};
//                 })
//                 .then((result) => {
//                     return verifyProfile(result.userId, result.emailCode, undefined)
//                         .catch((error) => {
//                             expect(error).to.exist.and.to.equal("phone-code-required");
//                         });
//                 })
//                 .then((profile) => {
//                     expect(profile).to.not.exist;
//                 });
//         });
//
//         it("for an active user", () => {
//             return DbManager.db.query("FOR profile in Profile filter profile.email==@email return profile", {email: "one@test.com"})
//                 .then(cursor => {
//                     return cursor.next();
//                 })
//                 .then((user) => {
//                     expect(user).to.exist;
//                     expect(user._id).to.exist;
//                     return {userId: user._id, emailCode: "000000", phoneCode: "000000"};
//                 })
//                 .then((result) => {
//                     return verifyProfile(result.userId, result.emailCode, result.phoneCode)
//                         .catch((error) => {
//                             expect(error).to.exist.and.to.equal("profile-not-new");
//                         });
//                 })
//                 .then((profile) => {
//                     expect(profile).to.not.exist;
//                 });
//         });
//         it("for a banned user");
//         it("for a deactivated user");
//         it("non existing user");
//     });
// });
