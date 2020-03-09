const expect = require('chai').expect;
const Profile = require('../../modules/models/profile');
const Threads = require('../../modules/models/message_thread');
const createResponse = require("../../modules/responses/create_response");
const createRequest = require("../../modules/requests/create_request");
const activateRequest = require("../../modules/requests/activate_request");
const activateResponse = require('../../modules/responses/activate_response');
const getThreadForRequest = require('../../modules/threads/get_thread_for_request');
const DbManager = require('../../modules/db/db_manager');

describe.skip('getting thread for request', () => {
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
    it('should return thread for existing request for request creator', () => {
        return getThreadForRequest(userId1, requestId)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.threadId).to.exist.and.to.be.string;
            });
    });
    it('should return thread for response creator', () => {
        return getThreadForRequest(userId2, requestId)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.threadId).to.exist;
            });
    });
    it('should fail if request not exists', () => {
        return getThreadForRequest(userId1, "Request/12342342")
            .catch(error => {
                expect(error).to.exist.and.to.equal("request-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if not a participant in request', () => {
        return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "three@test.com"})
            .then(cursor => {
                return cursor.next();
            })
            .then(user=>{
                return getThreadForRequest(user._id,requestId)
                    .catch(error=>{
                        expect(error).to.exist.and.to.equal("request-not-found");
                    });
            })
            .then(result=>{
                expect(result).to.not.exist;
            });
    });

    it('should fail for draft request');
});
