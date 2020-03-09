const expect = require('chai').expect;
const getMeta = require('../../modules/responses/get_meta');
const createRequest = require('../../modules/requests/create_request');
const createResponse = require('../../modules/responses/create_response');
const activateRequest = require('../../modules/requests/activate_request');
const activateResponse = require('../../modules/responses/activate_response');
const Utils = require('../../modules/utils/index');
const Response = require('../../modules/models/response');
const Profile = require('../../modules/models/profile');
const DbManager = require('../../modules/db/db_manager');

describe('getting response meta data', () => {
    let requestId1;
    let requestId2;
    let responseId1;
    let responseId2;
    let userId1;
    let userId2;
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
                requestId1 = result.request._id;
                return activateRequest(userId1, requestId1);
            })
            .then(() => {
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
                requestId2 = result.request._id;
                return activateRequest(userId2, requestId2);
            })
            .then(() => {
                requestData.requestId = requestId1;
                return createResponse(userId2, requestData);
            })
            .then((result) => {
                responseId1 = result.response._id;
                return activateResponse(userId2, responseId1);
            })
            .then(() => {
                requestData.requestId = requestId2;
                return createResponse(userId1, requestData);
            })
            .then(result => {
                responseId2 = result.response._id;
                return activateResponse(userId1, responseId2);
            });
    });
    it('should return active response', () => {
        return getMeta(userId1, [responseId1, responseId2])
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.data).to.exist.and.to.have.length(2);
                let response = result.data[0];
                expect(response).to.exist;
                expect(response._id).to.exist.and.to.equal(responseId1);
                expect(response.modifiedOn).to.exist;

                response = result.data[1];
                expect(response).to.exist;
                expect(response._id).to.exist.and.to.equal(responseId2);
                expect(response.modifiedOn).to.exist;
            });
    });
    it('should return completed responses', () => {
        return DbManager.db.collection("Response").update(responseId1, {status: "completed"})
            .then(result => {
                return getMeta(userId1, [responseId1, responseId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.data).to.exist.and.to.have.length(2);
                let response = result.data[0];
                expect(response).to.exist;
                expect(response._id).to.exist.and.to.equal(responseId1);
                expect(response.modifiedOn).to.exist;

                response = result.data[1];
                expect(response).to.exist;
                expect(response._id).to.exist.and.to.equal(responseId2);
                expect(response.modifiedOn).to.exist;
            });
    });

    it('should return rejected responses', () => {
        return DbManager.db.collection("Response").update(responseId1, {status: "rejected"})
            .then(result => {
                return getMeta(userId1, [responseId1, responseId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.data).to.exist.and.to.have.length(2);
                let response = result.data[0];
                expect(response).to.exist;
                expect(response._id).to.exist.and.to.equal(responseId1);
                expect(response.modifiedOn).to.exist;

                response = result.data[1];
                expect(response).to.exist;
                expect(response._id).to.exist.and.to.equal(responseId2);
                expect(response.modifiedOn).to.exist;
            });
    });
    it('should not return deleted responses', () => {
        return DbManager.db.collection("Response").update(responseId1, {deleted: true})
            .then(result => {
                return getMeta(userId1, [responseId1, responseId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.data).to.exist.and.to.have.length(1);
                let response = result.data[0];

                expect(response).to.exist;
                expect(response._id).to.exist.and.to.equal(responseId2);
                expect(response.modifiedOn).to.exist;
            });
    });
    it.skip('should not return banned responses', () => {
        return Response.findById(responseId1).exec()
            .then(response => {
                response.banned = true;
                return response.save();
            })
            .then(result => {
                return getMeta(userId1, [responseId1, responseId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.data).to.exist.and.to.have.length(1);
                let response = result.data[0];

                expect(response).to.exist;
                expect(response._id).to.exist.and.to.equal(responseId2);
                expect(response.modifiedOn).to.exist;
            });
    });
    it('should not return draft responses', () => {
        return DbManager.db.collection("Response").update(responseId1, {status: "draft"})
            .then(result => {
                return getMeta(userId1, [responseId1, responseId2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.data).to.exist.and.to.have.length(1);
                let response = result.data[0];

                expect(response).to.exist;
                expect(response._id).to.exist.and.to.equal(responseId2);
                expect(response.modifiedOn).to.exist;
            });
    });
    it('should not return if not the requester or response creator', () => {
        return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "three@test.com"})
            .then(cursor => {
                return cursor.next();
            })
            .then(user => {
                return getMeta(user._id, [responseId1, responseId2]);
            })
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.data).to.exist.and.to.have.length(0);
            });
    });
    it('should fail with id list not provided', () => {
        return getMeta(userId1)
            .then(result => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist.and.to.equal("empty-data");
            });
    });
    it('should only return responses created from the user if user not requester', () => {
        let userId3;
        let responseId3;
        return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "three@test.com"})
            .then(cursor => {
                return cursor.next();
            })
            .then(user => {
                userId3 = user._id;
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
                requestData.requestId = requestId1;
                return createResponse(user._id, requestData);
            })
            .then(result => {
                responseId3 = result.response._id;
                return activateResponse(userId3, responseId3);
            })
            .then(() => {
                return getMeta(userId3, [responseId1, responseId2, responseId3])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.data).to.exist.and.to.have.length(1);
                let response = result.data[0];
                expect(response).to.exist;
                expect(response._id).to.exist.and.to.equal(responseId3);
                expect(response.modifiedOn).to.exist;
            });
    });
});