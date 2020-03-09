const expect = require('chai').expect;
const Utils = require('../../modules/utils/index');

const getMultiple = require('../../modules/responses/get_multiple');
const createRequest = require('../../modules/requests/create_request');
const createResponse = require('../../modules/responses/create_response');
const activateRequest = require('../../modules/requests/activate_request');
const activateResponse = require('../../modules/responses/activate_response');

const Response = require('../../modules/models/response');
const Profile = require('../../modules/models/profile');

const DbManager = require('../../modules/db/db_manager');

describe('getting multiple responses', () => {
    let requestId1;
    let requestId2;
    let responseId1;
    let responseId2;
    let userId1 = "one@test.com";
    let userId2 = "two@test.com";
    beforeEach(() => {
        const requestData = {
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
        };

        return createRequest("one@test.com", requestData)
            .then(result => {
                requestId1 = result.request._id;
                return activateRequest("one@test.com", requestId1);
            })
            .then(() => {
                return createRequest("two@test.com", requestData);
            })
            .then(result => {
                requestId2 = result.request._id;
                expect(requestId2).to.exist.and.to.be.string;
                return activateRequest("two@test.com", requestId2);
            })
            .then(() => {
                requestData.requestId = requestId1;
                return createResponse("two@test.com", requestData);
            })
            .then((result) => {
                responseId1 = result.response._id;
                expect(responseId1).to.exist.and.to.be.string;
                return activateResponse("two@test.com", responseId1);
            })
            .then(() => {
                requestData.requestId = requestId2;
                return createResponse("one@test.com", requestData);
            })
            .then(result => {
                responseId2 = result.response._id;
                return activateResponse("one@test.com", responseId2);
            });
    });

    it('should return active response', () => {
        return getMultiple(userId1, [responseId1, responseId2])
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.responses).to.exist.and.to.have.length(2);

                let response = result.results.responses[0];
                expect(response).to.exist;
                expect(response.createdBy).to.exist.and.to.equal(userId2);

                response = result.results.responses[1];
                expect(response).to.exist;
                expect(response.createdBy).to.exist.and.to.equal(userId1);
                expect(response.location).to.exist;
            });
    });
    it('should return completed response', () => {
        return Response.update({_id: responseId1}, {status: "completed"}).exec()
            .then(() => {
                return getMultiple(userId1, [responseId1, responseId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.responses).to.exist.and.to.have.length(2);

                let response = result.results.responses[0];
                expect(response).to.exist;
                expect(response.createdBy).to.exist.and.to.equal(userId2);

                response = result.results.responses[1];
                expect(response).to.exist;
                expect(response.createdBy).to.exist.and.to.equal(userId1);
            });
    });

    it('should return rejected response', () => {
        return Response.update({_id: responseId1}, {status: "rejected"}).exec()
            .then(() => {
                return getMultiple(userId1, [responseId1, responseId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.responses).to.exist.and.to.have.length(2);

                let response = result.results.responses[0];
                expect(response).to.exist;
                expect(response.createdBy).to.exist.and.to.equal(userId2);

                response = result.results.responses[1];
                expect(response).to.exist;
                expect(response.createdBy).to.exist.and.to.equal(userId1);
            });
    });
    it('should not return deleted response', () => {
        return Response.update({_id: responseId1}, {deleted: true}).exec()
            .then(() => {
                return getMultiple(userId1, [responseId1, responseId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.responses).to.exist.and.to.have.length(1);

                let response = result.results.responses[0];
                expect(response).to.exist;
                expect(response.createdBy).to.exist.and.to.equal(userId1);
            });
    });
    it.skip('should not return banned response', () => {
        return Response.findById(responseId1).exec()
            .then(response => {
                response.banned = true;
                return response.save();
            })
            .then(() => {
                return getMultiple(userId1, [responseId1, responseId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.responses).to.exist.and.to.have.length(1);

                let response = result.results.responses[0];
                expect(response).to.exist;
                expect(response.createdBy).to.exist.and.to.equal(userId1);
            });
    });
    it('should not return draft response', () => {
        return Response.update({_id: responseId1}, {status: "draft"}).exec()
            .then(() => {
                return getMultiple(userId1, [responseId1, responseId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.responses).to.exist.and.to.have.length(1);

                let response = result.results.responses[0];
                expect(response).to.exist;
                expect(response.createdBy).to.exist.and.to.equal(userId1);
            });
    });
    it('should not return if not request or response creator', () => {
        let userId3 = "three@test.com";
        let responseId3;

        const requestData = {
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
        };
        requestData.requestId = requestId1;
        return createResponse(userId3, requestData)
            .then(result => {
                responseId3 = result.response._id;
                return activateResponse(userId3, responseId3);
            })
            .then(() => {
                return getMultiple(userId3, [responseId1, responseId2, responseId3])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.results.responses).to.exist.and.to.have.length(1);
            });
    });
});