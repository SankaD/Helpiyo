// const expect = require('chai').expect;
//
// const createRequest = require("../../modules/requests/create_request");
// const createResponse = require("../../modules/responses/create_response");
// const activateRequest = require("../../modules/requests/activate_request");
// const activateResponse = require('../../modules/responses/activate_response');
//
// const createComment = require('../../modules/comments/create_comment');
// const getMultiple = require('../../modules/comments/get_multiple');
//
// const DbManager = require('../../modules/db/db_manager');
//
// describe('getting multiple comments', () => {
//     let currentRequest;
//     let currentResponse;
//     let requestCreator;
//     let responseCreator;
//
//     beforeEach(() => {
//         let requestData = {
//             post: "testing post 123",
//             startTime: new Date(),
//             endTime: new Date(),
//             locationName: "TestLocation",
//             latitude: 40,
//             longitude: 5,
//             points: 500,
//             money: 200,
//             currency: "USD",
//             tags: ["test", "testing"],
//             photos: ["test photo", "test photo 1"],
//             banned: false
//         };
//         return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
//             .then(cursor => {
//                 return cursor.next();
//             })
//             .then(user => {
//                 requestCreator = user;
//                 return createRequest(user._id, requestData);
//             })
//             .then(result => {
//                 currentRequest = result.request;
//                 return activateRequest(currentRequest.createdBy, currentRequest._id);
//             })
//             .then(() => {
//                 return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
//                     .then(cursor => {
//                         return cursor.next();
//                     });
//             })
//             .then(user => {
//                 responseCreator = user;
//                 requestData.requestId = currentRequest._id;
//                 return createResponse(user._id, requestData);
//             })
//             .then(result => {
//                 currentResponse = result.response;
//                 return activateResponse(currentResponse.createdBy, currentResponse._id);
//             });
//     });
//     it('should return comments', () => {
//         let commentData = {
//             comment: "testing 123",
//             commentType: "text",
//             targetType: "request",
//             targetId: currentRequest._id
//         };
//         return createComment(requestCreator._id, commentData)
//             .then(result => {
//                 return getMultiple(requestCreator._id, [result.commentId])
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
//     it('should return empty list when ids are empty', () => {
//         return getMultiple(requestCreator._id, [])
//             .catch(error => {
//                 expect(error).to.not.exist;
//             })
//             .then(result => {
//                 expect(result).to.exist;
//                 expect(result.code).to.exist.and.to.equal(200);
//                 expect(result.data).to.exist.and.to.have.length(0);
//             });
//     });
//     it('should ignore non existing comments', () => {
//         return getMultiple(requestCreator._id, ["6b2326c4dfc37f32f0935695"])
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