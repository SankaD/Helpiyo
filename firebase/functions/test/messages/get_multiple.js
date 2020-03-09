// const expect = require('chai').expect;
//
// const createMessage = require('../../modules/messages/create_message');
// const getThreadForUser = require('../../modules/threads/get_thread_for_user');
// const getMultiple = require('../../modules/messages/get_multiple');
//
// describe('getting multiple messages', () => {
//     let thread;
//     beforeEach(() => {
//         return getThreadForUser("one@test.com", "two@test.com")
//             .then(result => {
//                 thread = result.threadId;
//             });
//     });
//     it('should return messages if exists', () => {
//         return createMessage("one@test.com", thread, "testing 123")
//             .catch(error => {
//                 expect(error).to.not.exist;
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.messageResult).to.exist;
//
//                 return getMultiple("one@test.com", [result.messageResult._id])
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
//     it('should return empty list if ids empty', () => {
//         return getMultiple("one@test.com", [])
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
//         return createMessage("one@test.com", thread, "testing 123")
//             .catch(error => {
//                 expect(error).to.not.exist;
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.messageId).to.exist;
//
//                 return getMultiple("one@test.com", [result.messageId, "6b2326c4dfc37f32f0935695"])
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
//         return createMessage("one@test.com", thread, "testing 123")
//             .catch(error => {
//                 expect(error).to.not.exist;
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.messageId).to.exist.and.to.be.string;
//
//                 return getMultiple("three@test.com", [result.messageId, "6b2326c4dfc37f32f0935695"])
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