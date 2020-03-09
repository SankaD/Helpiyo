// const expect = require('chai').expect;
// // const Message = require('../../modules/models/message');
// const Profile = require('../../modules/models/profile');
// const MessageThread = require('../../modules/models/message_thread');
//
// const createMessage = require('../../modules/messages/create_message');
// const getThreadForUser = require('../../modules/threads/get_thread_for_user');
// const getMultipleMeta = require('../../modules/messages/get_multiple_meta');
//
// const DbManager = require('../../modules/db/db_manager');
//
// describe('getting multiple messages meta', () => {
//     let userId1;
//     let userId2;
//     let userId3;
//     let thread;
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
//                 return getThreadForUser(userId1, userId2);
//             })
//             .then(result => {
//                 thread = result.threadId;
//             });
//     });
//     it('should return messages if exists', () => {
//         return createMessage(userId1, thread, "testing 123")
//             .catch(error => {
//                 expect(error).to.not.exist;
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.messageId).to.exist;
//
//                 return getMultipleMeta(userId1, [result.messageId])
//                     .catch(error => {
//                         expect(error).to.not.exist;
//                     });
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.data).to.exist.and.to.have.length(1);
//                 let message = result.data[0];
//                 expect(message).to.exist;
//                 expect(message._id).to.exist.and.to.be.string;
//                 expect(message.modifiedOn).to.exist;
//             });
//     });
//     it('should return empty list if ids empty', () => {
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
//     it('should ignore non existing messages', () => {
//         return createMessage(userId1, thread, "testing 123")
//             .catch(error => {
//                 expect(error).to.not.exist;
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.messageId).to.exist;
//
//                 return getMultipleMeta(userId1, [result.messageId, "6b2326c4dfc37f32f0935695"])
//                     .catch(error => {
//                         expect(error).to.not.exist;
//                     });
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.data).to.exist.and.to.have.length(1);
//             });
//     });
//     it("should ignore deleted messages by user");
//     it('should ignore if not in thread', () => {
//         return createMessage(userId1, thread, "testing 123")
//             .catch(error => {
//                 expect(error).to.not.exist;
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.messageId).to.exist.and.to.be.string;
//
//                 return getMultipleMeta(userId3, [result.messageId, "6b2326c4dfc37f32f0935695"])
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
//     it('should return group thread messages');
// });