const expect = require("chai").expect;
const moment = require('moment');
const Utils = require('../../modules/utils/index');
const createRequest = require('../../modules/requests/create_request');
const activateRequest = require('../../modules/requests/activate_request');
const createResponse = require('../../modules/responses/create_response');
const activateResponse = require('../../modules/responses/activate_response');
const Response = require('../../modules/models/response');
const Profile = require('../../modules/models/profile');
const DbManager = require('../../modules/db/db_manager');

describe("activate response", () => {
    let requestCreator;
    let requestId;
    let responseId;
    let responseCreator;
    beforeEach(() => {
        const request = {
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
        return createRequest("one@test.com", request)
            .then(result => {
                requestId = result.request._id;
                expect(requestId).to.exist.and.to.be.string;
                return activateRequest("one@test.com", requestId);
            })
            .then(profile => {
                const response = {
                    requestId: requestId,
                    post: "testing post 123",
                    startTime: moment().utc().valueOf(),
                    endTime: moment().utc().valueOf(),
                    locationName: "TestLocation",
                    latitude: 40,
                    longitude: 5,
                    points: 500,
                    money: 200,
                    currency: "USD",
                };
                return createResponse("two@test.com", response);
            })
            .then(result => {
                responseId = result.response._id;
                expect(responseId).to.exist.and.to.be.string;
            });
    });
    it('should pass activating an active response', () => {
        return activateResponse("two@test.com", responseId)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            });

    });
    it('should fail activating an already accepted response', () => {
        return activateResponse("two@test.com", responseId)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            })
            .then(() => {
                return activateResponse("two@test.com", responseId)
                    .then((result) => {
                        expect(result).to.not.exist;
                    })
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("response-not-found");
                    });
            });
    });
    it.skip('should fail activating a non existing response', () => {
        return activateResponse("two@test.com", "nonexisting")
            .then(result => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist.and.to.equal("response-not-found");
            });

    });
    it('should fail activating response by a user who is not request creator', () => {
        return activateResponse("one@test.com", responseId)
            .then(result => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist.and.to.equal("response-not-found");
            });
    });
    it('should fail if user is banned', () => {

    });
    it('should fail if response is deleted', () => {
        return Response.update({_id: responseId}, {deleted: true}).exec()
            .then(() => {
                return activateResponse("two@test.com", responseId)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("response-not-found");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
});