const expect = require("chai").expect;
const moment = require('moment');

const createResponse = require("../../modules/responses/create_response");
const createRequest = require("../../modules/requests/create_request");
const acceptResponse = require("../../modules/responses/accept_response");
const activateResponse = require('../../modules/responses/activate_response');
const activateRequest = require('../../modules/requests/activate_request');

const deleteRequest = require('../../modules/requests/delete_request');

const Request = require('../../modules/models/request');
const Response = require('../../modules/models/response');
const Profile = require('../../modules/models/profile');

const DbManager = require('../../modules/db/db_manager');

describe('deleting request', () => {
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
    it('should pass when deleting active request', () => {
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

        let requestId;

        return createRequest(requestCreatorId, request)
            .then(result => {
                requestId = result.request._id;
                return activateRequest(requestCreatorId, result.request._id);
            })
            .then(result => {
                return deleteRequest(requestCreatorId, requestId)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);

                return DbManager.db.collection("Request").document(requestId);
            })
            .then(request => {
                expect(request).to.exist;
                expect(request.status).to.exist.and.to.equal("active");
                expect(request.deleted).to.exist.and.to.be.true;
            });
    });
    it('if has active responses, should not be deleted', () => {
        return deleteRequest(requestCreatorId, requestId)
            .catch(error => {
                expect(error).to.exist.and.to.equal("active-responses-exist");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if there are accepted responses', () => {
        return DbManager.db.collection("Response").update(responseId, {status: "accepted"})
            .then(() => {
                return deleteRequest(requestCreatorId, requestId)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("active-responses-exist");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });

    it('should fail if there are completed responses', () => {
        return DbManager.db.collection("Response").update(responseId, {status: "completed"})
            .then(() => {
                return deleteRequest(requestCreatorId, requestId)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("active-responses-exist");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if request is completed', () => {
        return DbManager.db.collection("Request").update(requestId, {status: "completed"})
            .then(() => {
                return deleteRequest(requestCreatorId, requestId)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("invalid-status");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });

    it('should fail if request is draft', () => {
        return DbManager.db.collection("Request").update(requestId, {status: "draft"})
            .then(() => {
                return deleteRequest(requestCreatorId, requestId)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("invalid-status");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });

    });
    it.skip('should fail if request is banned', () => {
        return Request.findById(requestId).exec()
            .then(request => {
                expect(request).to.exist;
                request.banned = true;
                return request.save();
            })
            .then(() => {
                return deleteRequest(requestCreatorId, requestId)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal(Errors.requestNotFound);
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });

    });
    it('should fail if request is deleted', () => {
        return DbManager.db.collection("Request").update(requestId, {deleted: true})
            .then(() => {
                return deleteRequest(requestCreatorId, requestId)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("request-not-found");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });

    });
    it('should fail if not request creator', () => {
        return deleteRequest(responseCreatorId, requestId)
            .catch(error => {
                expect(error).to.exist.and.to.equal("request-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
});