const expect = require('chai').expect;
const createResponse = require("../../modules/responses/create_response");
const createRequest = require("../../modules/requests/create_request");
const activateRequest = require("../../modules/requests/activate_request");
const activateResponse = require('../../modules/responses/activate_response');
const promoteRequest = require('../../modules/requests/promote_request');
const hasPromoted = require('../../modules/requests/has_promoted');

const DbManager = require('../../modules/db/db_manager');

describe('has promoted request', () => {
    let userId1;
    let userId2;
    let requestId;
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
            .then(profile => {
                userId1 = profile._id;
                return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
                    .then(cursor => {
                        return cursor.next();
                    });
            })
            .then(profile => {
                userId2 = profile._id;
                return createRequest(userId1, request);
            })
            .then(result => {
                requestId = result.request._id;
                return activateRequest(userId1, result.request._id);
            })
            .then(() => {
                request.requestId = requestId;
                return createResponse(userId2, request);
            })
            .then(result => {
                return activateResponse(userId2, result.response._id);
            });
    });

    it('should return true if user promoted request', () => {
        return promoteRequest(userId1, requestId)
            .then(() => {
                return hasPromoted(userId1, requestId)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.promoted).to.exist.and.to.equal(true);
            });
    });
    it('should return false if user never promoted request', () => {
        return hasPromoted(userId1, requestId)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.promoted).to.exist.and.to.equal(false);
            });
    });
    it('should return false if user unpromoted request', () => {
        return promoteRequest(userId1, requestId)
            .then(() => {
                return hasPromoted(userId1, requestId)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.promoted).to.exist.and.to.equal(true);
                return promoteRequest(userId1, requestId);
            })
            .then(() => {
                return hasPromoted(userId1, requestId)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.promoted).to.exist.and.to.equal(false);
            });
    });
    it('should fail if request not found', () => {
        return promoteRequest(userId1, "Request/1231423423")
            .catch(error => {
                expect(error).to.exist.and.to.equal("request-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should return false if request is draft', () => {
        return DbManager.db.collection("Request").update(requestId, {status: "draft"})
            .then(() => {
                return hasPromoted(userId1, requestId)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });

            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.promoted).to.exist.and.to.equal(false);
            });
    });
});