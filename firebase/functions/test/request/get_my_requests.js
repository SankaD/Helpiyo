const expect = require('chai').expect;
const getMyRequests = require('../../modules/requests/get_my_requests');
const createRequest = require('../../modules/requests/create_request');
const activateRequest = require('../../modules/requests/activate_request');
const Utils = require('../../modules/utils/index');
const Request = require('../../modules/models/request');
const Profile = require('../../modules/models/profile');
const DbManager = require('../../modules/db/db_manager');

describe('getting my requests', () => {
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
        return getMyRequests(requestCreatorId)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(1);
                let request = results.data[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(requestId);
                expect(request.modifiedOn).to.exist;
            });
    });
    it('should return completed requests', () => {
        return DbManager.db.collection("Request").document(requestId)
            .then(request => {
                return DbManager.db.collection("Request").update(requestId, {status: "completed"});
            })
            .then(result => {
                return getMyRequests(requestCreatorId)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(1);
                let request = results.data[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(requestId);
                expect(request.modifiedOn).to.exist;
            });
    });
    it('should return processed requests', () => {
        return DbManager.db.collection("Request").document(requestId)
            .then(request => {
                return DbManager.db.collection("Request").update(requestId, {status: "processing"});
            })
            .then(result => {
                return getMyRequests(requestCreatorId)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(1);
                let request = results.data[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(requestId);
                expect(request.modifiedOn).to.exist;
            });
    });
    it('should not return deleted request', () => {
        return DbManager.db.collection("Request").document(requestId)
            .then(request => {
                return DbManager.db.collection("Request").update(requestId, {deleted: true});
            })
            .then(result => {
                return getMyRequests(requestCreatorId)
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
    it.skip('should not return banned requests', () => {
        return Request.findById(requestId).exec()
            .then(request => {
                request.banned = true;
                return request.save();
            })
            .then(result => {
                return getMyRequests(requestCreatorId)
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
    it('should not return draft request', () => {
        return DbManager.db.collection("Request").document(requestId)
            .then(request => {
                return DbManager.db.collection("Request").update(requestId, {status: "draft"});
            })
            .then(result => {
                return getMyRequests(requestCreatorId)
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
    it('should return empty list if no requests found', () => {
        return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
            .then(cursor => {
                return cursor.next();
            })
            .then(user => {
                return getMyRequests(user._id)
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
});