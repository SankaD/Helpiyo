const expect = require('chai').expect;
const Profile = require('../../modules/models/profile');
const Request = require('../../modules/models/request');
const createRequest = require("../../modules/requests/create_request");
const createResponse = require("../../modules/responses/create_response");
const activateRequest = require("../../modules/requests/activate_request");
const activateResponse = require('../../modules/responses/activate_response');

const createComment = require('../../modules/comments/create_comment');
const getCommentsFor = require('../../modules/comments/get_comments_for');

describe('getting comments for', () => {
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
        return Profile.findById("one@test.com").exec()
            .then(user => {
                requestCreator = user;
                return createRequest(user._id, requestData);
            })
            .then(result => {
                currentRequest = result.request;
                return activateRequest(currentRequest.createdBy, currentRequest._id);
            })
            .then(() => {
                return Profile.findById("two@test.com").exec();
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
    it('should return comments for requests', () => {
        let commentData = {
            comment: "testing 123",
            commentType: "text",
            targetType: "request",
            targetId: currentRequest._id
        };
        return createComment(requestCreator._id, commentData)
            .then(() => {
                return getCommentsFor(requestCreator._id, "request", currentRequest._id)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results).to.exist;
                expect(result.results.comments).to.exist.and.to.have.length(1);
                let comment = result.results.comments[0];
                expect(result.results.profiles).to.exist.and.to.have.key(comment.from);
                expect(comment).to.exist;
                expect(comment._id).to.exist.and.to.be.string;
                expect(comment.creator).to.not.exist;
                expect(comment.to).to.exist.and.to.be.string;
                expect(comment.modifiedOn).to.exist;
            });
    });
    it('should return comments for response', () => {
        let commentData = {
            comment: "testing 123",
            commentType: "text",
            targetType: "response",
            targetId: currentResponse._id
        };
        return createComment(requestCreator._id, commentData)
            .then(() => {
                return getCommentsFor(requestCreator._id, "response", currentResponse._id)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results).to.exist;
                expect(result.results.comments).to.exist.and.to.have.length(1);
                let comment = result.results.comments[0];
                expect(result.results.profiles).to.exist.and.to.have.key(comment.from);
                expect(comment).to.exist;
                expect(comment._id).to.exist.and.to.be.string;
                expect(comment.modifiedOn).to.exist;
            });
    });
    it('should fail if target id not provided', () => {
        return getCommentsFor(requestCreator._id, null)
            .catch(error => {
                expect(error).to.exist.and.to.equal("target-id-required");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it.skip('should fail if target is banned', () => {
        let commentData = {
            comment: "testing 123",
            commentType: "text",
            targetType: "request",
            targetId: currentRequest._id
        };
        return createComment(requestCreator._id, commentData)
            .then((result) => {
                return Request.findByIdAndUpdate(currentRequest._id, {banned: true}).exec();
            })
            .then(() => {
                return getCommentsFor(requestCreator._id, currentRequest._id)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal(Errors.targetNotFound);
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });

    });
    it.skip('should pass if target is deleted', () => {
        let commentData = {
            comment: "testing 123",
            commentType: "text",
            targetType: "request",
            targetId: currentRequest._id
        };
        return createComment(requestCreator._id, commentData)
            .then((result) => {
                return Request.findByIdAndUpdate(currentRequest._id, {deleted: true}).exec();
            })
            .then(() => {
                return getCommentsFor(requestCreator._id, "request", currentRequest._id)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.comments).to.exist.and.to.have.length(0);
            });
    });
    it('should return empty list if not comments exists', () => {
        return getCommentsFor(requestCreator._id, "request", currentRequest._id)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.comments).to.exist.and.to.have.length(0);
            });
    });
});