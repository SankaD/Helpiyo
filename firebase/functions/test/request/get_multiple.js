const expect = require("chai").expect;

const createRequest = require("../../modules/requests/create_request");
const createResponse = require("../../modules/responses/create_response");
const getMultiple = require("../../modules/requests/get_multiple");
const activateRequest = require('../../modules/requests/activate_request');
const activateResponse = require('../../modules/responses/activate_response');
const promoteRequest = require('../../modules/requests/promote_request');

const Request = require('../../modules/models/request');
const Profile = require('../../modules/models/profile');
const Response = require('../../modules/models/response');

const DbManager = require('../../modules/db/db_manager');

describe("getting multiple requests", () => {
    let activeRequestId;
    let activeRequestId2;
    let activeResponseId;
    let userId1 = "one@test.com";
    let userId2 = "two@test.com";
    let userId3 = "three@test.com";

    beforeEach(() => {
        const requestData = {
            post: "testing post 123",
            startTime: new Date(),
            endTime: new Date(),
            locationName: "TestLocation",
            locationSet: true,
            location: {coordinates: [5, 40]},
            points: 500,
            money: 200,
            currency: "USD",
            tags: ["test", "testing"],
            photos: ["test photo", "test photo 1"],
        };

        return createRequest(userId1, requestData)
            .then(result => {
                activeRequestId = result.request._id;
                return createRequest(userId2, requestData);
            })
            .then(result => {
                activeRequestId2 = result.request._id;
                return activateRequest(userId1, activeRequestId);
            })
            .then(() => {
                return activateRequest(userId2, activeRequestId2);
            })
            .then(() => {
                requestData.requestId = activeRequestId2;
                return createResponse(userId3, requestData);
            })
            .then(result => {
                activeResponseId = result.response._id;
                return activateResponse(userId3, activeResponseId);
            });
    });

    it('should return empty when ids empty', () => {
        return getMultiple(userId1, [])
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.requests).to.exist.and.to.have.length(0);
            });
    });
    it('should fail if request ids null', () => {
        return getMultiple(userId1)
            .then(result => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist.and.to.equal("empty-data");
            });
    });
    it('should return request if ids has single id', () => {
        return getMultiple(userId1, [activeRequestId])
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.requests).to.exist.and.to.have.length(1);
                let request = result.results.requests[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId);
                expect(request.responseId).to.not.exist;
                expect(request.location).to.exist;
                expect(request.locationSet).to.exist;
                expect(request.locationName).to.exist;
                expect(request.promoted).to.exist.and.to.equal(false);
            });
    });
    it('should return multiple requests if ids has multiple ids', () => {
        return getMultiple(userId3, [activeRequestId, activeRequestId2])
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.requests).to.exist.and.to.have.length(2);
                let request = result.results.requests[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId);
                expect(request.responseId).to.not.exist;
                expect(request.location).to.exist;
                expect(request.locationSet).to.exist;
                expect(request.locationName).to.exist;
                request = result.results.requests[1];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId2);
                expect(request.responseId).to.exist.and.to.be.string;
                expect(request.location).to.exist;
                expect(request.locationSet).to.exist;
                expect(request.locationName).to.exist;
            });
    });
    it('should set response id if responded to request', () => {
        return getMultiple(userId3, [activeRequestId, activeRequestId2])
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.requests).to.exist.and.to.have.length(2);
                let request = result.results.requests[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId);
                expect(request.responseId).to.not.exist;
                request = result.results.requests[1];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId2);
                expect(request.responseId).to.exist.and.to.equal(activeResponseId);
            });
    });
    it('should not include deleted requests', () => {
        return Request.update({_id: activeRequestId}, {deleted: true}).exec()
            .then(() => {
                return getMultiple(userId1, [activeRequestId, activeRequestId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.requests).to.exist.and.to.have.length(1);
                let request = result.results.requests[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId2);
                expect(request.responseId).to.exist;
            });
    });
    it.skip('should not include banned requests', () => {
        return DbManager.db.collection("Request").document(activeRequestId)
            .then(request => {
                return DbManager.db.collection("Request").update(request._id, {banned: true});
            })
            .then(() => {
                return getMultiple(userId1, [activeRequestId, activeRequestId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.requests).to.exist.and.to.have.length(1);
                let request = result.results.requests[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId2);
                expect(request.responseId).to.exist;
            });
    });
    it('should not include draft requests', () => {
        return Request.findByIdAndUpdate(activeRequestId, {status: "draft"})
            .then(() => {
                return getMultiple(userId1, [activeRequestId, activeRequestId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.requests).to.exist.and.to.have.length(1);
                let request = result.results.requests[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId2);
                // expect(request.responseId).to.not.exist;
            });
    });
    it('should not set response id if response is draft', () => {

        return Response.findByIdAndUpdate(activeResponseId, {status: "draft"})
            .then(() => {
                return getMultiple(userId3, [activeRequestId, activeRequestId2]);
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.requests).to.exist.and.to.have.length(2);
                let request = result.results.requests[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId);
                expect(request.responseId).to.not.exist;
                request = result.results.requests[1];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId2);
                expect(request.responseId).to.not.exist;
            });
    });
    it('should not set response if response is deleted', () => {
        return Response.findByIdAndUpdate(activeResponseId, {deleted: true})
            .then(() => {
                return getMultiple(userId3, [activeRequestId, activeRequestId2]);
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.requests).to.exist.and.to.have.length(2);
                let request = result.results.requests[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId);
                expect(request.responseId).to.not.exist;
                request = result.results.requests[1];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId2);
                expect(request.responseId).to.not.exist;
            });
    });
    it.skip('should not set response if response is banned', () => {
        return DbManager.db.collection("Response").document(activeRequestId)
            .then(request => {
                return DbManager.db.collection("Response").update(request._id, {banned: true});
            })
            .then(() => {
                return getMultiple(userId3, [activeRequestId, activeRequestId2]);
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.requests).to.exist.and.to.have.length(2);
                let request = result.results.requests[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId);
                expect(request.points).to.exist;
                expect(request.responseId).to.not.exist;
                request = result.results.requests[1];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId2);
                expect(request.points).to.exist;
                expect(request.responseId).to.not.exist;
            });
    });

    it('should not include non existing requests', () => {
        return getMultiple(userId1, [activeRequestId, activeRequestId2, "5afb71e8b0d82b0db0992170"])
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.requests).to.exist.and.to.have.length(2);
                let request = result.results.requests[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId);
                expect(request.points).to.exist;
                expect(request.responseId).to.not.exist;
                request = result.results.requests[1];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(activeRequestId2);
                expect(request.points).to.exist;
                expect(request.responseId).to.exist.and.to.equal(activeResponseId);
            });
    });
    it('should return promoted as true for promoted requests', () => {
        return promoteRequest(userId1, activeRequestId)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result.promoted).to.exist.and.to.equal(true);
                return getMultiple(userId1, [activeRequestId])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.requests).to.exist.and.to.have.length(1);
                let request = result.results.requests[0];
                expect(request).to.exist;
                expect(request.promoted).to.exist.and.to.equal(true);
            });
    });
});