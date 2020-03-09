const expect = require("chai").expect;
const getRequestsBy = require("../../modules/requests/get_active_requests_by");
const createRequest = require("../../modules/requests/create_request");
const activateRequest = require('../../modules/requests/activate_request');
const Utils = require('../../modules/utils/index');
const Profile = require('../../modules/models/profile');
const Request = require('../../modules/models/request');
const DbManager = require('../../modules/db/db_manager');

describe('getting active requests by user', () => {
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
    it('should return active requests', () => {
        return getRequestsBy(requestCreatorId)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(1);
                let requestData = results.data[0];
                expect(requestData).to.exist;
                expect(requestData._id).to.exist.and.to.equal(requestId);
                expect(requestData.modifiedOn).to.exist;
            });
    });
    it('should not return completed requests', () => {
        return DbManager.db.collection("Request").document(requestId)
            .then(request => {
                return DbManager.db.collection("Request").update(requestId, {status: "completed"});
            })
            .then(result => {
                return getRequestsBy(requestCreatorId)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(0);
            });
    });
    it('should not return deleted requests', () => {
        return DbManager.db.collection("Request").document(requestId)
            .then(request => {
                return DbManager.db.collection("Request").update(requestId, {deleted: true});
            })
            .then(result => {
                return getRequestsBy(requestCreatorId)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(0);
            });
    });
    it.skip('should not return banned request', () => {
        return Request.findById(requestId).exec()
            .then(request => {
                request.banned = true;
                return request.save();
            })
            .then(result => {
                return getRequestsBy(requestCreatorId)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(0);
            });
    });
    it.skip('should not return processed requests', () => {
        return Request.findById(requestId).exec()
            .then(request => {
                request.status = "processed";
                return request.save();
            })
            .then(result => {
                return getRequestsBy(requestCreatorId)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(0);
            });
    });
    it('should not return draft requests', () => {
        return DbManager.db.collection("Request").document(requestId)
            .then(request => {
                return DbManager.db.collection("Request").update(requestId, {status: "draft"});
            })
            .then(result => {
                return getRequestsBy(requestCreatorId)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(0);
            });
    });
    it('should return empty list if no requests exists', () => {
        return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
            .then(cursor => {
                return cursor.next();
            })
            .then(user => {
                return getRequestsBy(user._id);
            })
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(0);
            });
    });
    it.skip('should fail if user non existing', () => {
        return getRequestsBy("1affb0b0665d453d304ac908")
            .then(results => {
                expect(results).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist.and.to.equal(Errors.profileNotFound);
            });
    });
});

