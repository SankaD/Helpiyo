// /*
// const expect = require('chai').expect;
// const Profile = require('../../modules/models/profile');
// const DbManager = require('../../modules/db/db_manager');
//
// const getMultiple = require('../../modules/profile/get_multiple');
//
// describe.only('getting multiple profiles', () => {
//
//     beforeEach(() => {
//
//     });
//     it('should return a single profile', () => {
//         let userId2;
//
//         return getMultiple("one@test.com", ["two@test.com"])
//             .catch(error => {
//                 expect(error).to.not.exist;
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.data).to.exist.and.to.have.length(1);
//                 let profile = result.data[0];
//                 expect(profile).to.exist;
//                 expect(profile._id).to.exist.and.to.equal(userId2);
//                 expect(profile.createdOn).to.exist;
//             });
//     });
//     it('should return multiple profiles', () => {
//
//         return getMultiple("one@test.com", ["two@test.com", "three@test.com"])
//             .catch(error => {
//                 expect(error).to.not.exist;
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.data).to.exist.and.to.have.length(2);
//                 let profile = result.data[0];
//                 expect(profile).to.exist;
//                 expect(profile.email).to.not.exist;
//                 expect(profile.createdOn).to.exist;
//                 profile = result.data[1];
//                 expect(profile).to.exist;
//                 expect(profile.email).to.not.exist;
//             });
//     });
//     it('should return new profiles', () => {
//
//         return getMultiple("one@test.com", ["three@test.com"])
//             .catch(error => {
//                 expect(error).to.not.exist;
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.data).to.exist.and.to.have.length(0);
//             });
//     });
//     it('should not return deactivated profile', () => {
//
//
//         return Profile.findById("two@test.com", {deactivated: true}).exec()
//             .then(() => {
//                 return getMultiple("one@test.com", ["two@test.com"])
//                     .catch(error => {
//                         expect(error).to.not.exist;
//                     });
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.data).to.exist.and.to.have.length(0);
//             });
//     });
//     it.skip('should not return banned profile', () => {
//         let userId;
//         return Profile.findOne({email: "two@test.com"}).exec()
//             .then(profile => {
//                 userId = profile._id;
//                 profile.banned = true;
//                 return profile.save();
//             })
//             .then(() => {
//                 return getMultiple("one@test.com", ["two@test.com"])
//                     .catch(error => {
//                         expect(error).to.not.exist;
//                     });
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.data).to.exist.and.to.have.length(0);
//             });
//     });
// });*/
