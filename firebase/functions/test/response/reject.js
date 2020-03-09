const moment = require("moment");

const expect = require("chai").expect;
const rejectResponse = require("../../modules/responses/reject_response");
const createResponse = require("../../modules/responses/create_response");
const createRequest = require("../../modules/requests/create_request");
const activateResponse = require("../../modules/responses/activate_response");
const activateRequest = require("../../modules/requests/activate_request");
const acceptResponse = require('../../modules/responses/accept_response');

const Profile = require('../../modules/models/profile');
const Response = require('../../modules/models/response');

const DbManager = require('../../modules/db/db_manager');

describe("reject response", () => {
    let activeRequestId;
    let activeResponseId;
    let requestCreatorId;
    let responseCreatorId;
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
            unwantedText: "testing"
        };
        return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
            .then(cursor => {
                return cursor.next();
            })
            .then((user) => {
                expect(user).to.exist;
                expect(user._id).to.exist;
                requestCreatorId = user._id;
                return createRequest(requestCreatorId, request);
            })
            .then((result) => {
                activeRequestId = result.request._id;
                return activateRequest(requestCreatorId, activeRequestId);
            })
            .then((request) => {
                const responseData = {
                    requestId: activeRequestId,
                    post: "testing post 123",
                    startTime: moment().utc().valueOf(),
                    endTime: moment().utc().valueOf(),
                    locationName: "TestLocation",
                    latitude: 40,
                    longitude: 5,
                    points: 400,
                    money: 200,
                    currency: "USD",
                    tags: ["test", "testing"],
                    photos: ["test photo", "test photo 1"],
                    unwantedText: "testing"
                };
                return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
                    .then(cursor => {
                        return cursor.next();
                    })
                    .then((user) => {
                        expect(user).to.exist;
                        expect(user._id).to.exist;
                        responseCreatorId = user._id;
                        return createResponse(user._id, responseData)
                            .catch((error) => {
                                expect(error).to.not.exist;
                            });
                    })
                    .then((result) => {
                        expect(result).to.exist;
                        activeResponseId = result.response._id;
                        return activateResponse(responseCreatorId, activeResponseId);
                    });
            });
    });
    it("active response should be rejected without setting a rating", () => {
        return rejectResponse(requestCreatorId, activeResponseId, {})
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            });
    });
    it('should be able to reject accepted response with a rating', () => {
        return acceptResponse(requestCreatorId, activeResponseId)
            .then(result => {
                return rejectResponse(requestCreatorId, activeResponseId, {
                    ratingValue: 4,
                    ratingComment: "test comment 1"
                })
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
            });
    });
    it('should not be able to reject accepted response without a rating', () => {
        return acceptResponse(requestCreatorId, activeResponseId)
            .then(() => {
                return rejectResponse(requestCreatorId, activeResponseId, {})
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("validation-failure");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should not be able to reject if not request creator', () => {
        return rejectResponse(responseCreatorId, activeResponseId, {})
            .catch(error => {
                expect(error).to.exist.and.to.equal("response-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should not be able to reject already rejected response', () => {
        return acceptResponse(requestCreatorId, activeResponseId)
            .then(result => {
                return rejectResponse(requestCreatorId, activeResponseId, {
                    ratingValue: 4,
                    ratingComment: "test comment 1"
                })
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;

                return rejectResponse(requestCreatorId, activeResponseId, {
                    ratingValue: 4,
                    ratingComment: "test comment 2"
                })
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("already-rejected");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it.skip('should not be able to reject banned response', () => {
        return Response.findById(activeResponseId).exec()
            .then(response => {
                response.banned = true;
                return response.save();
            })
            .then(() => {
                return rejectResponse(requestCreatorId, activeResponseId, {
                    ratingValue: 4,
                    ratingComment: "test comment 2"
                })
                    .catch(error => {
                        expect(error).to.exist.and.to.equal(Errors.responseNotFound);
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should not be able to reject a deleted response', () => {
        return DbManager.db.collection("Response").update(activeResponseId, {deleted: true})
            .then(() => {
                return rejectResponse(requestCreatorId, activeResponseId, {
                    ratingValue: 4,
                    ratingComment: "test comment 2"
                })
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("response-not-found");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should not be able to reject a non existing response', () => {
        return rejectResponse(requestCreatorId, "6b079f3c7a34978bd0260c60", {ratingValue: 4, ratingComment: "aaaaaa"})
            .catch(error => {
                expect(error).to.exist.and.to.equal("response-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
});