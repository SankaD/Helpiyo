const expect = require("chai").expect;
const Utils = require('../../modules/utils/index');

const Request = require('../../modules/models/request');
const Profile = require('../../modules/models/profile');

const createRequest = require("../../modules/requests/create_request");
const createResponse = require("../../modules/responses/create_response");
const activateRequest = require('../../modules/requests/activate_request');
const activateResponse = require('../../modules/responses/activate_response');
const getMeta = require('../../modules/requests/get_multiple_meta');

const DbManager = require('../../modules/db/db_manager');

describe('getting request meta data list', () => {
    let activeRequestId;
    let activeRequestId2;
    let activeResponseId;
    let userId1;
    let userId2;
    let userId3;

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
                userId1 = user._id;
                return createRequest(userId1, requestData);
            })
            .then(result => {
                activeRequestId = result.request._id;
                return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
                    .then(cursor => {
                        return cursor.next();
                    });
            })
            .then(user => {
                userId2 = user._id;
                return createRequest(userId2, requestData);
            })
            .then(result => {
                activeRequestId2 = result.request._id;
                return activateRequest(userId1, activeRequestId);
            })
            .then(() => {
                return activateRequest(userId2, activeRequestId2);
            })
            .then(() => {
                return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "three@test.com"})
                    .then(cursor => {
                        return cursor.next();
                    });
            })
            .then(user => {
                userId3 = user._id;
                requestData.requestId = activeRequestId2;
                return createResponse(userId3, requestData);
            })
            .then(result => {
                activeResponseId = result.response._id;
                return activateResponse(userId3, activeResponseId);
            });
    });
    it('should return empty list if ids are empty', () => {
        return getMeta(userId1, [])
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.data).to.exist.and.to.have.length(0);
            });
    });
    it('should fail if ids not provided', () => {
        return getMeta(userId1)
            .then(result => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist.and.to.equal("empty-data");
            });
    });
    it('should return data for single request', () => {
        return getMeta(userId1, [activeRequestId])
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.data).to.exist.and.to.have.length(1);
                let entry = result.data[0];
                expect(entry).to.exist;
                expect(entry._id).to.exist.and.to.equal(activeRequestId);
                expect(entry.modifiedOn).to.exist;
            });
    });
    it('should return data for multiple requests', () => {
        return getMeta(userId1, [activeRequestId, activeRequestId2])
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.data).to.exist.and.to.have.length(2);
                let entry = result.data[0];
                expect(entry).to.exist;
                expect(entry._id).to.exist.and.to.equal(activeRequestId);
                expect(entry.modifiedOn).to.exist;
                entry = result.data[1];
                expect(entry).to.exist;
                expect(entry._id).to.exist.and.to.equal(activeRequestId2);
                expect(entry.modifiedOn).to.exist;
            });
    });
    it('should ignore non existing ids', () => {
        return getMeta(userId1, [activeRequestId, activeRequestId2, "2aff9832566f1a494c6f34b0"])
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.data).to.exist.and.to.have.length(2);
                let entry = result.data[0];
                expect(entry).to.exist;
                expect(entry._id).to.exist.and.to.equal(activeRequestId);
                expect(entry.modifiedOn).to.exist;
                entry = result.data[1];
                expect(entry).to.exist;
                expect(entry._id).to.exist.and.to.equal(activeRequestId2);
                expect(entry.modifiedOn).to.exist;
            });
    });
    it('should ignore deleted requests', () => {
        return DbManager.db.collection("Request").update(activeRequestId, {deleted: true})
            .then(() => {
                return getMeta(userId1, [activeRequestId, activeRequestId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.data).to.exist.and.to.have.length(1);
                let entry = result.data[0];
                expect(entry).to.exist;
                expect(entry._id).to.exist.and.to.equal(activeRequestId2);
                expect(entry.modifiedOn).to.exist;
            });
    });
    it('should ignore draft requests', () => {
        return DbManager.db.collection("Request").update(activeRequestId, {status: "draft"})
            .then(() => {
                return getMeta(userId1, [activeRequestId, activeRequestId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.data).to.exist.and.to.have.length(1);
                let entry = result.data[0];
                expect(entry).to.exist;
                expect(entry._id).to.exist.and.to.equal(activeRequestId2);
                expect(entry.modifiedOn).to.exist;
            });
    });
    it.skip('should ignore banned requests', () => {
        return Request.findById(activeRequestId).exec()
            .then(request => {
                request.banned = true;
                return request.save();
            })
            .then(result => {
                return getMeta(userId1, [activeRequestId, activeRequestId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.data).to.exist.and.to.have.length(1);
                let entry = result.data[0];
                expect(entry).to.exist;
                expect(entry._id).to.exist.and.to.equal(activeRequestId2);
                expect(entry.modifiedOn).to.exist;
            });
    });
});