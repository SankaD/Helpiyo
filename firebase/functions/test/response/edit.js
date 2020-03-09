const moment = require("moment");

const expect = require("chai").expect;

const createResponse = require("../../modules/responses/create_response");
const createRequest = require("../../modules/requests/create_request");
const activateResponse = require('../../modules/responses/activate_response');
const activateRequest = require('../../modules/requests/activate_request');
const editResponse = require('../../modules/responses/edit_response');

const Response = require('../../modules/models/response');
const Profile = require('../../modules/models/profile');
const DbManager = require('../../modules/db/db_manager');

describe('editing response', () => {
    let activeRequest;
    let activeResponse;
    let requestCreatorId;
    let responseCreatorId;
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

    beforeEach(() => {
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
            .then(request => {
                activeRequest = request.request;
                return activateRequest(requestCreatorId, activeRequest._id);
            })
            .then(() => {
                return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
                    .then(cursor => {
                        return cursor.next();
                    })
                    .then((user) => {
                        expect(user).to.exist;
                        expect(user._id).to.exist;
                        responseCreatorId = user._id;
                        const responseData = {
                            requestId: activeRequest._id,
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
                        return createResponse(responseCreatorId, responseData)
                            .catch((error) => {
                                expect(error).to.not.exist;
                            });
                    });
            })
            .then((result) => {
                expect(result).to.exist;
                activeResponse = result.response;
            })
            .then(() => {
                return activateResponse(responseCreatorId, activeResponse._id);
            });
    });
    it('should pass with valid data', () => {
        activeResponse.post = "testing post 2 123";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];

        return editResponse(responseCreatorId, activeResponse)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            });
    });
    it('should fail if post is empty', () => {
        activeResponse.post = "";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];

        return editResponse(responseCreatorId, activeResponse)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if post is too short', () => {
        activeResponse.post = "test";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];

        return editResponse(responseCreatorId, activeResponse)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if post is too long', () => {
        activeResponse.post = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc congue ex vel tellus dignissim, sed laoreet tortor dictum. Vestibulum ante sapien, viverra a sodales et, fringilla pharetra augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus porttitor vehicula dictum. Aliquam viverra velit ornare, tincidunt mi at, mollis velit. Integer tempus non erat vel iaculis. Vivamus a sollicitudin arcu, vitae facilisis sem. Vivamus at sagittis nisi massa nunc afsdf sd fsd sfd s.";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];

        return editResponse(responseCreatorId, activeResponse)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if points amount is 0', () => {
        activeResponse.post = "testing post 2 123";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 0;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];
        return editResponse(responseCreatorId, activeResponse)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if money provided without currency', () => {
        activeResponse.post = "testing post 2 123";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = undefined;
        activeResponse.tags = ["test", "test2"];
        return editResponse(responseCreatorId, activeResponse)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if currency provided without money', () => {
        activeResponse.post = "testing post 2 123";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = undefined;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];
        return editResponse(responseCreatorId, activeResponse)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should pass if location not provided ', () => {
        activeResponse.post = "testing post 2 123";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = undefined;
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];
        return editResponse(responseCreatorId, activeResponse)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            });
    });
    it('should fail if start time is not provided', () => {
        activeResponse.post = "testing post 2 123";
        activeResponse.startTime = undefined;
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];
        return editResponse(responseCreatorId, activeResponse)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if end time is smaller than start time', () => {
        activeResponse.post = "testing post 2 123";
        activeResponse.startTime = moment().utc().valueOf();
        // activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];
        return editResponse(responseCreatorId, activeResponse)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if deleted response', () => {
        activeResponse.post = "testing post 2 123";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];
        return DbManager.db.collection("Response").update(activeResponse._id, {deleted: true})
            .then(() => {
                return editResponse(responseCreatorId, activeResponse)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("response-not-found");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if accepted response', () => {
        activeResponse.post = "testing post 2 123";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];
        return DbManager.db.collection("Response").update(activeResponse._id, {status: "accepted"})
            .then(() => {
                return editResponse(responseCreatorId, activeResponse)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("already-accepted");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if rejected response', () => {
        activeResponse.post = "testing post 2 123";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];
        return DbManager.db.collection("Response").update(activeResponse._id, {status: "rejected"})
            .then(() => {
                return editResponse(responseCreatorId, activeResponse)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("already-rejected");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it.skip('should fail if banned response', () => {
        activeResponse.post = "testing post 2 123";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];
        return Response.findById(activeResponse._id).exec()
            .then(response => {
                response.banned = true;
                return response.save();
            })
            .then(() => {
                return editResponse(responseCreatorId, activeResponse)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("response-not-found");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('request id should not be changed', () => {
        activeResponse.post = "testing post 2 123";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];
        let originalId = activeResponse.requestId;
        activeResponse.requestId = "1affb0b0665d453d304ac908";
        return editResponse(responseCreatorId, activeResponse)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                return DbManager.db.collection("Response").document(activeResponse._id);
            })
            .then(response => {
                expect(originalId).to.equal(response.requestId);
            });
    });
    it('should fail if response not found', () => {
        activeResponse.post = "testing post 2 123";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];
        activeResponse._id = "1affb0b0665d453d304ac908";
        return editResponse(responseCreatorId, activeResponse)
            .catch(error => {
                expect(error).to.exist.and.to.equal("response-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if draft response', () => {
        activeResponse.post = "testing post 2 123";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];
        return DbManager.db.collection("Response").update(activeResponse._id, {status: "draft"})
            .then(() => {
                return editResponse(responseCreatorId, activeResponse)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("response-not-found");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if not response creator', () => {
        activeResponse.post = "testing post 2 123";
        activeResponse.startTime = moment().utc().valueOf();
        activeResponse.endTime = moment().utc().valueOf();
        activeResponse.locationName = "Test Location 2";
        activeResponse.latitude = 10;
        activeResponse.longitude = 22;
        activeResponse.points = 200;
        activeResponse.money = 10;
        activeResponse.currency = "LKR";
        activeResponse.tags = ["test", "test2"];

        return editResponse(requestCreatorId, activeResponse)
            .catch(error => {
                expect(error).to.exist.and.to.equal("response-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
});
