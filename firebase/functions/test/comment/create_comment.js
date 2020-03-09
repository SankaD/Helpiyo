const expect = require('chai').expect;
const Profile = require('../../modules/models/profile');

const createRequest = require("../../modules/requests/create_request");
const createResponse = require("../../modules/responses/create_response");
const activateRequest = require("../../modules/requests/activate_request");
const activateResponse = require('../../modules/responses/activate_response');

const createComment = require('../../modules/comments/create_comment');

const DbManager = require('../../modules/db/db_manager');

describe('create comment', () => {
    let currentRequest;
    let currentResponse;
    let requestCreator;
    let responseCreator;

    beforeEach(() => {
        let requestData = {
            post: "testing post 123",
            startTime: new Date(),
            endTime: new Date(),
            locationName: "TestLocation",
            latitude: 40,
            longitude: 5,
            points: 500,
            money: 200,
            currency: "USD",
            tags: ["test", "testing"],
            photos: ["test photo", "test photo 1"],
            banned: false
        };
        return Profile.findOne({_id: "one@test.com"}).exec()
            .then(user => {
                requestCreator = user;
                return createRequest(user._id, requestData);
            })
            .then(result => {
                currentRequest = result.request;
                return activateRequest(currentRequest.createdBy, currentRequest._id);
            })
            .then(() => {
                return Profile.findOne({_id: "two@test.com"}).exec();
            })
            .then(user => {
                responseCreator = user;
                requestData.requestId = currentRequest._id;
                return createResponse(user._id, requestData);
            })
            .then(result => {
                currentResponse = result.response;
                return activateResponse(currentResponse.createdBy, currentResponse._id);
            });
    });
    it('should pass when commenting on a request', () => {
        let commentData = {
            comment: "testing 123",
            commentType: "text",
            targetType: "request",
            targetId: currentRequest._id
        };
        return createComment(requestCreator._id, commentData)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            });
    });
    it('should pass when commenting on a response by involved', () => {
        let commentData = {
            comment: "testing 123",
            commentType: "text",
            targetType: "response",
            targetId: currentResponse._id
        };
        return createComment(requestCreator._id, commentData)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            });
    });
    it('should fail if comment content is empty', () => {
        let commentData = {
            comment: "",
            commentType: "text",
            targetType: "response",
            targetId: currentResponse._id
        };
        return createComment(requestCreator._id, commentData)
            .catch(error => {
                expect(error).to.exist;
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should pass if comment type is not provided', () => {
        let commentData = {
            comment: "testing 123",
            // commentType: "text",
            targetType: "response",
            targetId: currentResponse._id
        };
        return createComment(requestCreator._id, commentData)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
            });
    });
    it('should fail if target id is not provided', () => {
        let commentData = {
            comment: "testing 123",
            commentType: "text",
            targetType: "response",
            // targetId: currentResponse._id
        };
        return createComment(requestCreator._id, commentData)
            .catch(error => {
                expect(error).to.exist.and.to.equal("target-id-required");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if user id is not provided', () => {
        let commentData = {
            comment: "testing 123",
            commentType: "text",
            targetType: "response",
            targetId: currentResponse._id
        };
        return createComment(null, commentData)
            .catch(error => {
                expect(error).to.exist.and.to.equal("user-id-required");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it.skip('should fail if invalid comment type', () => {
        let commentData = {
            comment: "testing 123",
            commentType: "text123",
            targetId: currentResponse._id
        };
        return createComment(requestCreator._id, commentData)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it.skip('should fail if target not exists', () => {
        let commentData = {
            comment: "testing 123",
            commentType: "text",
            targetId: currentResponse._id
        };
        return createComment(requestCreator._id, commentData)
            .catch(error => {
                expect(error).to.exist.and.to.equal("target-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
});