// const expect = require('chai').expect;
// const Thread = require('../../modules/models/message_thread');
// const Profile = require("../../modules/models/profile");
// const getMultipleMeta = require('../../modules/threads/get_multiple_meta');
// const getThreadForUser = require('../../modules/threads/get_thread_for_user');
// const DbManager = require('../../modules/db/db_manager');
//
// describe('get multiple threads meta data', () => {
//     let userId1;
//     let userId2;
//     let userId3;
//     beforeEach(() => {
//         return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
//             .then(cursor => {
//                 return cursor.next();
//             })
//             .then(profile => {
//                 userId1 = profile._id;
//                 return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
//                     .then(cursor => {
//                         return cursor.next();
//                     });
//             })
//             .then(profile => {
//                 userId2 = profile._id;
//                 return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "three@test.com"})
//                     .then(cursor => {
//                         return cursor.next();
//                     });
//             })
//             .then(profile => {
//                 userId3 = profile._id;
//             });
//     });
//     it('should return if thread exists', () => {
//         let thread1;
//         let thread2;
//         return getThreadForUser(userId1, userId2)
//             .then(result => {
//                 thread1 = result.threadId;
//                 return getThreadForUser(userId1, userId3);
//             })
//             .then(result => {
//                 thread2 = result.threadId;
//                 return getMultipleMeta(userId1, [thread1, thread2])
//                     .catch(error => {
//                         expect(error).to.not.exist;
//                     });
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.data).to.exist.and.to.have.length(2);
//                 let thread = result.data[0];
//                 expect(thread).to.exist;
//                 expect(thread.modifiedOn).to.exist;
//                 expect(thread._id).to.exist.and.to.be.string;
//                 expect(thread.name).to.not.exist;
//                 expect(thread.createdOn).to.not.exist;
//             });
//     });
//     it('should ignore non existing threads', () => {
//         let thread1;
//         let thread2;
//         return getThreadForUser(userId1, userId2)
//             .then(result => {
//                 thread1 = result.threadId;
//                 return getThreadForUser(userId1, userId3);
//             })
//             .then(result => {
//                 thread2 = result.threadId;
//                 return getMultipleMeta(userId1, [thread1, thread2, "6b2326c4dfc37f32f0935695"])
//                     .catch(error => {
//                         expect(error).to.not.exist;
//                     });
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.data).to.exist.and.to.have.length(2);
//             });
//     });
//     it('should return empty if ids are empty', () => {
//         return getMultipleMeta(userId1, [])
//             .catch(error => {
//                 expect(error).to.not.exist;
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.data).to.exist.and.to.have.length(0);
//             });
//     });
// });
