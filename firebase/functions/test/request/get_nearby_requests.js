const expect = require('chai').expect;
const createRequest = require('../../modules/requests/create_request');
const activateRequest = require('../../modules/requests/activate_request');
const getNearestRequests = require('../../modules/requests/get_nearby_requests');
const Utils = require('../../modules/utils/index');
const Request = require('../../modules/models/request');
const Profile = require('../../modules/models/profile');

const DbManager = require('../../modules/db/db_manager');

describe('getting nearby requests', () => {
    let requestId;
    let requestCreatorId;
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
        return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
            .then(cursor => {
                return cursor.next();
            })
            .then(user => {
                requestCreatorId = user._id;
                return createRequest(requestCreatorId, requestData);
            })
            .then(result => {
                requestId = result.request._id;
                return activateRequest(requestCreatorId, requestId);
            });
    });
    it.skip('should pass if no requests found', () => {
        return getNearestRequests(requestCreatorId, -40, 30, 5)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.requests).to.exist.and.to.have.length(0);
            });
    });
    it('should pass with requests present', () => {
        return getNearestRequests(requestCreatorId, 40, 5, 10)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.requests).to.exist.and.to.have.length(1);
            });
    });
    it('should fail if latitude is not provided', () => {
        return getNearestRequests(requestCreatorId, undefined, 5, 10)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if longitude is not provided', () => {
        return getNearestRequests(requestCreatorId, 40, undefined, 10)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it.skip('should fail if radius is not provided', () => {
        return getNearestRequests(requestCreatorId, 40, 5, undefined)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should return requests upto max limit if radius is 0', () => {
        return getNearestRequests(requestCreatorId, 40, 5, 0)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.requests).to.exist.and.to.have.length(1);
            });
    });
    it.skip('should not return banned requests', () => {
        return Request.findById(requestId).exec()
            .then(request => {
                request.banned = true;
                return request.save();
            })
            .then(() => {
                return getNearestRequests(requestCreatorId, 40, 5, 10);
            })
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.requests).to.exist.and.to.have.length(0);
            });
    });
    it('should not return deleted requests', () => {
        return DbManager.db.collection("Request").update(requestId, {deleted: true})
            .then(() => {
                return getNearestRequests(requestCreatorId, 40, 5, 10);
            })
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.requests).to.exist.and.to.have.length(0);
            });
    });
    it('should not return draft requests', () => {
        return DbManager.db.collection("Request").update(requestId, {status: "draft"})
            .then(() => {
                return getNearestRequests(requestCreatorId, 40, 5, 10);
            })
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.requests).to.exist.and.to.have.length(0);
            });
    });
    it('should not return completed requests', () => {
        return DbManager.db.collection("Request").update(requestId, {status: "completed"})
            .then(() => {
                return getNearestRequests(requestCreatorId, 40, 5, 10);
            })
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.requests).to.exist.and.to.have.length(0);
            });
    });

});