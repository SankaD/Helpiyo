const expect = require('chai').expect;
const Utils = require('../../modules/utils/index');

const createRequest = require('../../modules/requests/create_request');
const createResponse = require('../../modules/responses/create_response');
const activateRequest = require('../../modules/requests/activate_request');
const activateResponse = require('../../modules/responses/activate_response');
const getMyResponses = require('../../modules/responses/get_my_responses');

const Response = require('../../modules/models/response');
const Profile = require('../../modules/models/profile');
const DbManager = require('../../modules/db/db_manager');

describe('getting my responses', () => {
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

    it('should return active responses', () => {
        return getMyResponses(userId1)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(results => {
                expect(results).to.exist;
                expect(results.code).to.exist.and.to.equal(200);
                expect(results.data).to.exist.and.to.have.length(1);

                let response = results.data[0];
                expect(response).to.exist;
                expect(response._id).to.exist.and.to.equal(responseId2);
                expect(response.modifiedOn).to.exist;
            });
    });
    it('should return completed responses', () => {
        return DbManager.db.collection("Response").update(responseId2, {status: "completed"})
            .then(() => {
                return getMyResponses(userId1)
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
                expect(response._id).to.exist.and.to.equal(responseId2);
                expect(response.modifiedOn).to.exist;
            });
    });
    it('should return processing responses', () => {
        return DbManager.db.collection("Response").update(responseId2, {status: "processing"})

            .then(() => {
                return getMyResponses(userId1)
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
                expect(response._id).to.exist.and.to.equal(responseId2);
                expect(response.modifiedOn).to.exist;
            });
    });
    it('should return accepted responses', () => {
        return DbManager.db.collection("Response").update(responseId2, {status: "accepted"})

            .then(() => {
                return getMyResponses(userId1)
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
                expect(response._id).to.exist.and.to.equal(responseId2);
                expect(response.modifiedOn).to.exist;
            });
    });
    it('should return rejected responses', () => {
        return DbManager.db.collection("Response").update(responseId2, {status: "rejected"})

            .then(() => {
                return getMyResponses(userId1)
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
                expect(response._id).to.exist.and.to.equal(responseId2);
                expect(response.modifiedOn).to.exist;
            });
    });
    it.skip('should not return banned responses', () => {
        return Response.findById(responseId2).exec()
            .then(response => {
                response.banned = true;
                return response.save();
            })
            .then(() => {
                return getMyResponses(userId1)
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
    it('should not return deleted responses', () => {
        return DbManager.db.collection("Response").update(responseId2, {deleted: true})

            .then(() => {
                return getMyResponses(userId1)
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
    it('should not return draft responses', () => {
        return DbManager.db.collection("Response").update(responseId2, {status: "draft"})
            .then(() => {
                return getMyResponses(userId1)
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
    it('should return empty list if no responses found', () => {
        return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "three@test.com"})
            .then(cursor => {
                return cursor.next();
            })
            .then(user => {
                return getMyResponses(user._id)
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