const expect = require('chai').expect;

const Utils = require('../../modules/utils/index');

const createRequest = require('../../modules/requests/create_request');
const createResponse = require('../../modules/responses/create_response');
const activateRequest = require('../../modules/requests/activate_request');
const activateResponse = require('../../modules/responses/activate_response');
const getResponses = require('../../modules/responses/get_responses_for_request');

const Response = require('../../modules/models/response');
const Profile = require('../../modules/models/profile');
const DbManager = require('../../modules/db/db_manager');

describe('getting responses for request', () => {
    let request1;
    let response1;
    let response2;
    let requestCreator;

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
        let responseCreator1;
        let responseCreator2;
        return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
            .then(cursor => {
                return cursor.next();
            })
            .then(user => {
                requestCreator = user._id;
                return createRequest(requestCreator, requestData);
            })
            .then(results => {
                request1 = results.request._id;
                return activateRequest(requestCreator, request1);
            })
            .then(results => {
                return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
                    .then(cursor => {
                        return cursor.next();
                    });
            })
            .then(user => {
                responseCreator1 = user._id;
                return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "three@test.com"})
                    .then(cursor => {
                        return cursor.next();
                    });
            })
            .then(user => {
                responseCreator2 = user._id;
                requestData.requestId = request1;
                return createResponse(responseCreator1, requestData);
            })
            .then(result => {
                response1 = result.response._id;
                return activateResponse(responseCreator1, response1);
            })
            .then(result => {
                requestData.requestId = request1;
                return createResponse(responseCreator2, requestData);
            })
            .then(result => {
                response2 = result.response._id;
                return activateResponse(responseCreator2, response2);
            });
    });

    it('should return active responses', () => {
        return getResponses(requestCreator, request1)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(2);

                let response = results.data[0];
                expect(response).to.exist;
                expect(response._id).to.exist;
                expect(response.modifiedOn).to.exist;
            });
    });
    it('should return completed responses', () => {
        return DbManager.db.collection("Response").update(response1, {status: "completed"})
            .then(result => {
                return getResponses(requestCreator, request1)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(2);

                let response = results.data[0];
                expect(response).to.exist;
                expect(response._id).to.exist;
                expect(response.modifiedOn).to.exist;
            });
    });
    it('should return rejected responses', () => {
        return DbManager.db.collection("Response").update(response1, {status: "rejected"})
            .then(result => {
                return getResponses(requestCreator, request1)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(2);

                let response = results.data[0];
                expect(response).to.exist;
                expect(response._id).to.exist;
                expect(response.modifiedOn).to.exist;
            });
    });
    it('should return accepted responses', () => {
        return DbManager.db.collection("Response").update(response1, {status: "accepted"})
            .then(result => {
                return getResponses(requestCreator, request1)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(2);

                let response = results.data[0];
                expect(response).to.exist;
                expect(response._id).to.exist;
                expect(response.modifiedOn).to.exist;
            });
    });
    it('should not return deleted responses', () => {
        return DbManager.db.collection("Response").update(response1, {deleted: true})
            .then(result => {
                return getResponses(requestCreator, request1)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(1);

                let response = results.data[0];
                expect(response).to.exist;
                expect(response._id).to.exist;
                expect(response.modifiedOn).to.exist;
            });
    });
    it('should not return draft responses', () => {
        return DbManager.db.collection("Response").update(response1, {status: "draft"})
            .then(result => {
                return getResponses(requestCreator, request1)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(1);

                let response = results.data[0];
                expect(response).to.exist;
                expect(response._id).to.exist;
                expect(response.modifiedOn).to.exist;
            });
    });
    it.skip('should not return banned response', () => {
        return Response.findById(response1).exec()
            .then(response => {
                response.banned = true;
                return response.save();
            })
            .then(result => {
                return getResponses(requestCreator, request1)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(1);

                let response = results.data[0];
                expect(response).to.exist;
                expect(response._id).to.exist;
                expect(response.modifiedOn).to.exist;
            });
    });
    it.skip('should fail if not request creator', () => {
        return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "three@test.com"})
            .then(cursor => {
                return cursor.next();
            })
            .then(user => {
                return getResponses(user._id, request1);
            })
            .then(results => {
                expect(results).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist.and.to.equal("not-request-creator");
            });
    });
    it('should return empty list if not responses are found', () => {
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
        let requestId;
        return createRequest(requestCreator, requestData)
            .then(result => {
                requestId = result.request._id;
                return activateRequest(requestCreator, requestId);
            })
            .then(() => {
                return getResponses(requestCreator, requestId)
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