const expect = require("chai").expect;
const moment = require('moment');

const createResponse = require("../../modules/responses/create_response");
const createRequest = require("../../modules/requests/create_request");
const acceptResponse = require("../../modules/responses/accept_response");
const activateResponse = require('../../modules/responses/activate_response');
const activateRequest = require('../../modules/requests/activate_request');

const deleteResponse = require('../../modules/responses/delete_response');

const Request = require('../../modules/models/request');
const Response = require('../../modules/models/response');
const Profile = require('../../modules/models/profile');

const DbManager = require('../../modules/db/db_manager');

describe("deleting response", () => {
    let responseId;
    let requestId;
    let responseCreatorId;
    let requestCreatorId;
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
        return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
            .then(cursor => {
                return cursor.next();
            })
            .then((user) => {
                expect(user).to.exist;
                expect(user._id).to.exist;

                requestCreatorId = user._id;
                return createRequest(user._id, request);
            })
            .then(result => {
                requestId = result.request._id;
                return activateRequest(requestCreatorId, requestId);
            })
            .then(() => {
                const responseData = {
                    requestId: requestId,
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
                };
                return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
                    .then(cursor => {
                        return cursor.next();
                    })
                    .then((user) => {
                        expect(user).to.exist;
                        expect(user._id).to.exist;
                        responseCreatorId = user._id;
                        return createResponse(responseCreatorId, responseData)
                            .catch((error) => {
                                expect(error).to.not.exist;
                            });
                    })
                    .then((result) => {
                        expect(result).to.exist;
                        responseId = result.response._id;
                    });
            })
            .then(() => {
                return activateResponse(responseCreatorId, responseId);
            });
    });
    it('should be deleted when active response deleted', () => {
        return deleteResponse(responseCreatorId, responseId)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            });
    });
    it('should not be deleted if accepted response', () => {
        return DbManager.db.collection("Response").update(responseId, {status: "accepted"})
            .then(response => {
                return deleteResponse(responseCreatorId, responseId)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("response-not-active");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should not be deleted if completed response', () => {
        return DbManager.db.collection("Response").update(responseId, {status: "completed"})
            .then(response => {
                return deleteResponse(responseCreatorId, responseId)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("response-not-active");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });

    it('should not be deleted if rejected response', () => {
        return DbManager.db.collection("Response").update(responseId, {status: "rejected"})
            .then(response => {
                return deleteResponse(responseCreatorId, responseId)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("response-not-active");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should not be deleted if draft response', () => {
        return DbManager.db.collection("Response").update(responseId, {status: "draft"})
            .then(response => {
                return deleteResponse(responseCreatorId, responseId)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("response-not-active");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should not be deleted if not response creator', () => {
        return deleteResponse(requestCreatorId, responseId)
            .catch(error => {
                expect(error).to.exist.and.to.equal("response-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if non existing response', () => {
        return deleteResponse(responseCreatorId, "6b0ad307d339dd20f0c4308a")
            .catch(error => {
                expect(error).to.exist.and.to.equal("response-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it.skip('should fail if response is banned', () => {
        return Response.findById(responseId).exec()
            .then(response => {
                response.banned = true;
                return response.save();
            })
            .then(() => {
                return deleteResponse(responseCreatorId, responseId)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal(Errors.responseNotFound);
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if already deleted', () => {
        return DbManager.db.collection("Response").update(responseId, {deleted: true})
            .then(() => {
                return deleteResponse(responseCreatorId, responseId)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("response-not-found");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
});