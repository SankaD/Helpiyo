const expect = require("chai").expect;
const moment = require('moment');
const createResponse = require("../../modules/responses/create_response");
const createRequest = require("../../modules/requests/create_request");
const activateRequest = require("../../modules/requests/activate_request");
const activateResponse = require('../../modules/responses/activate_response');
const Utils = require('../../modules/utils/index');
const Profile = require('../../modules/models/profile');
const Request = require('../../modules/models/request');
const Response = require('../../modules/models/response');
const DbManager = require('../../modules/db/db_manager');

describe("create response", () => {
    let activeRequest;

    beforeEach(() => {
        // create a request
        const request = {
            post: "testing post 123",
            startTime: new Date(),
            endTime: new Date(),
            locationName: "TestLocation",
            locationSet: true,
            location: {coordinates: [5, 40]},
            points: 500,
            money: 200,
            currency: "USD",
            tags: ["test", "testing"],
            photos: ["test photo", "test photo 1"],
            unwantedText: "testing"
        };

        return createRequest("one@test.com", request)
            .then((result) => {
                return activateRequest("one@test.com", result.request._id)
                    .then(() => {
                        activeRequest = result.request;
                    });
            });
    });
    describe("valid", () => {
        it("create response", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            let createdResponse;

            return createResponse("two@test.com", responseData)
                .catch((error) => {
                    expect(error).to.not.exist;
                })
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.code).to.exist.and.to.equal(200);
                    expect(result.response).to.exist;
                    const response = result.response;
                    expect(response._id).to.exist.and.to.be.string;
                    expect(response.post).to.exist.and.to.equal(responseData.post);
                    expect(response.startTime).to.exist;
                    expect(response.endTime).to.exist;
                    expect(response.locationName).to.exist.and.to.equal(responseData.locationName);
                    expect(response.location).to.exist;
                    expect(response.locationSet).to.exist.and.to.equal(true);
                    expect(response.money).to.exist.and.to.equal(responseData.money);
                    expect(response.photos).to.exist.and.to.eql(responseData.photos);
                    expect(response.status).to.exist.and.to.equal("draft");
                    expect(response.unwantedText).to.not.exist;
                    return result.response;
                })
                .then((response) => {
                    return Response.findById(response._id).exec();
                })
                .then((response) => {
                    expect(response.post).to.exist.and.to.equal(responseData.post);
                    expect(response.startTime).to.exist;
                    expect(response.endTime).to.exist;
                    expect(response.locationName).to.exist.and.to.equal(responseData.locationName);
                    expect(response.money).to.exist.and.to.equal(responseData.money);
                    expect(response.photos).to.exist.and.to.eql(responseData.photos);
                    expect(response.unwantedText).to.not.exist;
                    createdResponse = response;
                });
        });
        it.skip("with different points amount", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 600,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
                .then(cursor => {
                    return cursor.next();
                })
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return createResponse("two@test.com", responseData)
                        .catch((error) => {
                            expect(error).to.not.exist;
                        });
                })
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.code).to.exist.and.to.equal(200);
                    expect(result.response).to.exist;
                    const response = result.response;
                    expect(response.post).to.exist.and.to.equal(responseData.post);
                    expect(response.startTime).to.exist;
                    expect(response.endTime).to.exist;
                    expect(response.locationName).to.exist.and.to.equal(responseData.locationName);
                    expect(response.latitude).to.exist.and.to.equal(responseData.latitude);
                    expect(response.longitude).to.exist.and.to.equal(responseData.longitude);
                    expect(response.points).to.exist.and.to.equal(responseData.points);
                    expect(response.money).to.exist.and.to.equal(responseData.money);
                    expect(response.tags).to.not.exist;
                    expect(response.photos).to.exist.and.to.eql(responseData.photos);
                    expect(response.unwantedText).to.not.exist;
                    return result.response;
                })
                .then((response) => {
                    return DbManager.db.collection("Response").document(response._id);
                })
                .then(response => {
                    expect(response.post).to.exist.and.to.equal(responseData.post);
                    expect(response.startTime).to.exist;
                    expect(response.endTime).to.exist;
                    expect(response.locationName).to.exist.and.to.equal(responseData.locationName);
                    expect(response.points).to.exist.and.to.equal(responseData.points);
                    expect(response.money).to.exist.and.to.equal(responseData.money);
                    expect(response.tags).to.not.exist;
                    expect(response.photos).to.exist.and.to.eql(responseData.photos);
                    expect(response.unwantedText).to.not.exist;
                });
        });
        it("with different money payment", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                money: 600,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };

            return createResponse("two@test.com", responseData)
                .catch((error) => {
                    expect(error).to.not.exist;
                })
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.code).to.exist.and.to.equal(200);
                    expect(result.response).to.exist;
                    const response = result.response;
                    expect(response.post).to.exist.and.to.equal(responseData.post);
                    expect(response.startTime).to.exist;
                    expect(response.endTime).to.exist;
                    expect(response.locationName).to.exist.and.to.equal(responseData.locationName);
                    expect(response.money).to.exist.and.to.equal(responseData.money);
                    expect(response.photos).to.exist.and.to.eql(responseData.photos);
                    expect(response.unwantedText).to.not.exist;
                    return result.response;
                })
                .then((response) => {
                    return Response.findById(response._id).exec();
                })
                .then(response => {
                    expect(response.post).to.exist.and.to.equal(responseData.post);
                    expect(response.startTime).to.exist;
                    expect(response.endTime).to.exist;
                    expect(response.locationName).to.exist.and.to.equal(responseData.locationName);
                    expect(response.money).to.exist.and.to.equal(responseData.money);
                    expect(response.photos).to.exist.and.to.eql(responseData.photos);
                    expect(response.unwantedText).to.not.exist;
                });
        });
        it("with different currency", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                money: 200,
                currency: "LKR",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };

            return createResponse("two@test.com", responseData)
                .catch((error) => {
                    expect(error).to.not.exist;
                })
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.code).to.exist.and.to.equal(200);
                    expect(result.response).to.exist;
                    const response = result.response;
                    expect(response.post).to.exist.and.to.equal(responseData.post);
                    expect(response.startTime).to.exist;
                    expect(response.endTime).to.exist;
                    expect(response.locationName).to.exist.and.to.equal(responseData.locationName);
                    expect(response.money).to.exist.and.to.equal(responseData.money);
                    expect(response.photos).to.exist.and.to.eql(responseData.photos);
                    expect(response.unwantedText).to.not.exist;
                    return result.response;
                })
                .then((response) => {
                    return Response.findById(response._id).exec();
                })
                .then(response => {
                    expect(response.post).to.exist.and.to.equal(responseData.post);
                    expect(response.startTime).to.exist;
                    expect(response.endTime).to.exist;
                    expect(response.locationName).to.exist.and.to.equal(responseData.locationName);
                    expect(response.money).to.exist.and.to.equal(responseData.money);
                    expect(response.photos).to.exist.and.to.eql(responseData.photos);
                    expect(response.unwantedText).to.not.exist;
                });
        });
        it("with different start time");
        it("with different end time");
        it("with different location", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation2",
                locationSet: false,
                location: {coordinates: [3, 40]},
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };

            return createResponse("two@test.com", responseData)
                .catch((error) => {
                    expect(error).to.not.exist;
                })
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.code).to.exist.and.to.equal(200);
                    expect(result.response).to.exist;
                    const response = result.response;
                    expect(response.post).to.exist.and.to.equal(responseData.post);
                    expect(response.startTime).to.exist;
                    expect(response.endTime).to.exist;
                    expect(response.locationName).to.exist.and.to.equal(responseData.locationName);
                    expect(response.location).to.exist;
                    expect(response.locationSet).to.exist.and.to.equal(false);
                    expect(response.money).to.exist.and.to.equal(responseData.money);
                    expect(response.photos).to.exist.and.to.eql(responseData.photos);
                    expect(response.unwantedText).to.not.exist;
                    return result.response;
                })
                .then((response) => {
                    return Response.findById(response._id).exec();
                })
                .then(response => {
                    expect(response.post).to.exist.and.to.equal(responseData.post);
                    expect(response.startTime).to.exist;
                    expect(response.endTime).to.exist;
                    expect(response.locationName).to.exist.and.to.equal(responseData.locationName);
                    expect(response.money).to.exist.and.to.equal(responseData.money);
                    expect(response.photos).to.exist.and.to.eql(responseData.photos);
                    expect(response.unwantedText).to.not.exist;
                });
        });
        it("without photos", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                // photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };

            return createResponse("two@test.com", responseData)
                .catch((error) => {
                    expect(error).to.not.exist;
                })
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.code).to.exist.and.to.equal(200);
                    expect(result.response).to.exist;
                    const response = result.response;
                    expect(response.post).to.exist.and.to.equal(responseData.post);
                    expect(response.startTime).to.exist;
                    expect(response.endTime).to.exist;
                    expect(response.locationName).to.exist.and.to.equal(responseData.locationName);
                    expect(response.money).to.exist.and.to.equal(responseData.money);
                    expect(response.photos).to.exist.and.to.have.length(0);
                    expect(response.unwantedText).to.not.exist;
                    return result.response;
                })
                .then((response) => {
                    return Response.findById(response._id).exec();
                })
                .then(response => {
                    expect(response.post).to.exist.and.to.equal(responseData.post);
                    expect(response.startTime).to.exist;
                    expect(response.endTime).to.exist;
                    expect(response.locationName).to.exist.and.to.equal(responseData.locationName);
                    expect(response.money).to.exist.and.to.equal(responseData.money);
                    expect(response.photos).to.exist.and.to.have.length(0);
                    expect(response.unwantedText).to.not.exist;
                });
        });
        it.skip("with already deleted response for the request", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
                .then(cursor => {
                    return cursor.next();
                })
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return createResponse("two@test.com", responseData)
                        .catch((error) => {
                            expect(error).to.not.exist;
                        })
                        .then((result) => {
                            expect(result.code).to.exist.and.to.equal(200);
                            expect(result.response).to.exist;
                            expect(result.response._id).to.exist;
                            return Response.findById(result.response._id).exec();
                        })
                        .then(response => {
                            response.status = "deleted";
                            return response.save();
                        })
                        .then(() => {
                            return user;
                        });
                })
                .then((user) => {
                    return createResponse("two@test.com", responseData)
                        .catch((error) => {
                            expect(error).to.not.exist;
                        });
                })
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.code).to.exist.and.to.equal(200);
                    expect(result.response).to.exist;
                    const response = result.response;
                    expect(response.post).to.exist.and.to.equal(responseData.post);
                    expect(response.startTime).to.exist;
                    expect(response.endTime).to.exist;
                    expect(response.locationName).to.exist.and.to.equal(responseData.locationName);
                    expect(response.latitude).to.exist.and.to.equal(responseData.latitude);
                    expect(response.longitude).to.exist.and.to.equal(responseData.longitude);
                    expect(response.points).to.exist.and.to.equal(responseData.points);
                    expect(response.money).to.exist.and.to.equal(responseData.money);
                    expect(response.tags).to.not.exist;
                    expect(response.photos).to.exist.and.to.eql(responseData.photos);
                    expect(response.status).to.exist.and.to.equal("draft");
                    expect(response.unwantedText).to.not.exist;
                    return result.response;
                });
        });
    });
    describe("invalid", () => {
        it("without a post", () => {
            const responseData = {
                requestId: activeRequest._id,
                // post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };

            return createResponse("two@test.com", responseData)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("without request id", () => {
            const responseData = {
                // requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };

            return createResponse("two@test.com", responseData)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("request-not-found");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("with a short post", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            return createResponse("two@test.com", responseData)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("with a long post", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum dolor eu sodales consequat. Mauris rhoncus pulvinar lectus, eget semper metus semper eget. Morbi et porttitor metus. Sed et risus quam. Pellentesque sit amet rutrum nisi. Sed viverra massa id lacus rhoncus auctor. Proin at nibh sapien. Donec egestas justo at mauris tristique pharetra. Vestibulum fermentum maximus orci nec facilisis. Sed posuere lacus a mauris ultrices lobortis. Sed quis hendrerit ex. In eleifend dictum sed.a sda sdas",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };

            return createResponse("two@test.com", responseData)
                .then((result) => {
                    expect(result).to.not.exist;
                })
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                });
        });
        it.skip("with floating point, points amount", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500.05,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            return Profile.findOne({email: "two@test.com"}).exec()
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return createResponse("two@test.com", responseData)
                        .then((result) => {
                            expect(result).to.not.exist;
                        })
                        .catch((error) => {
                            expect(error).to.exist.and.to.equal("validation-failure");
                        });
                });

        });
        it.skip("with string points amount", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: "asdas",
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
                .then(cursor => {
                    return cursor.next();
                })
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return createResponse("two@test.com", responseData)
                        .catch((error) => {
                            expect(error).to.exist.and.to.equal("validation-failure");
                        });
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("with string money amount", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: "asdas",
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };

            return createResponse("two@test.com", responseData)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("new user", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };

            return createResponse("new@test.com", responseData)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("profile-not-active");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });

        it("banned response creator");
        it("deactivated response creator");
        it.skip("request status = processing", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            const requestRef = DbManager.db.collection("requests").doc(activeRequest._id);
            return requestRef.get()
                .then((requestDoc) => {
                    return requestRef.set({status: "processing"})
                        .then(() => {
                            return Profile.findOne({_id: "two@test.com"}).exec();
                        });
                })
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return createResponse("two@test.com", responseData)
                        .catch((error) => {
                            expect(error).to.exist;
                            expect(error.message).to.exist.and.to.equal(Errors.requestNotActive.message);
                            expect(error.code).to.exist.and.to.equal(Errors.requestNotActive.code);
                        });
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it.skip("request status = completed", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            const requestRef = DbManager.db.collection("requests").doc(activeRequest._id);
            return requestRef.get()
                .then((requestDoc) => {
                    return requestRef.set({status: "completed"})
                        .then(() => {
                            return Profile.findOne({_id: "two@test.com"}).exec();
                        });
                })
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return createResponse("two@test.com", responseData)
                        .catch((error) => {
                            expect(error).to.exist;
                            expect(error.message).to.exist.and.to.equal("request-not-active");
                            expect(error.code).to.exist.and.to.equal(400);
                        });
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it.skip("request status = banned", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            const requestRef = DbManager.db.collection("requests").doc(activeRequest._id);
            return requestRef.get()
                .then((requestDoc) => {
                    return requestRef.set({status: "banned"})
                        .then(() => {
                            return Profile.findOne({_id: "two@test.com"}).exec();
                        });
                })
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return createResponse("two@test.com", responseData)
                        .catch((error) => {
                            expect(error).to.exist;
                            expect(error.message).to.exist.and.to.equal("request-not-active");
                            expect(error.code).to.exist.and.to.equal(400);
                        });
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it.skip("request status = deleted", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            const requestRef = DbManager.db.collection("requests").doc(activeRequest._id);
            return requestRef.get()
                .then((requestDoc) => {
                    return requestRef.set({status: "deleted"})
                        .then(() => {
                            return Profile.findOne({email: "two@test.com"}).exec();
                        });
                })
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return createResponse(user._id, responseData)
                        .catch((error) => {
                            expect(error).to.exist;
                            expect(error.message).to.exist.and.to.equal("request-not-active");
                            expect(error.code).to.exist.and.to.equal(400);
                        });
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("current user has created the request", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };

            return createResponse("one@test.com", responseData)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("request-creator-cannot-respond");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("non existing requests");
        it("with already active response for the request", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };

            return createResponse("two@test.com", responseData)
                .catch((error) => {
                    expect(error).to.not.exist;
                })
                .then(result => {
                    return activateResponse(user._id, result.response._id);
                })
                .then(() => {
                    return user;
                })
                .then((user) => {
                    return createResponse(user._id, responseData)
                        .catch((error) => {
                            expect(error).to.exist.and.to.equal("already-responded");
                        });
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it.skip("with already banned response for the request", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
                .then(cursor => {
                    return cursor.next();
                })
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return createResponse(user._id, responseData)
                        .catch((error) => {
                            expect(error).to.not.exist;
                        })
                        .then((result) => {
                            expect(result.code).to.exist.and.to.equal(200);
                            expect(result.response).to.exist;
                            expect(result.response._id).to.exist;
                            const responseRef = DbManager.db.collection("responses").doc(result.response._id);
                            return responseRef.set({status: "banned"})
                                .catch((error) => {
                                    expect(error).to.not.exist;
                                });
                        })
                        .then(() => {
                            return user;
                        });
                })
                .then((user) => {
                    return createResponse(user._id, responseData)
                        .catch((error) => {
                            expect(error).to.exist;
                            expect(error.code).to.exist.and.to.equal(400);
                            expect(error.message).to.exist.and.to.equal("already-responded");
                        });
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it.skip("with already accepted response for the request", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            return Profile.findOne({email: "two@test.com"}).exec()
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return createResponse(user._id, responseData)
                        .catch((error) => {
                            expect(error).to.not.exist;
                        })
                        .then((result) => {
                            expect(result.code).to.exist.and.to.equal(200);
                            expect(result.response).to.exist;
                            expect(result.response._id).to.exist;
                            const responseRef = DbManager.db.collection("responses").doc(result.response._id);
                            return responseRef.set({status: "accepted"})
                                .catch((error) => {
                                    expect(error).to.not.exist;
                                });
                        })
                        .then(() => {
                            return user;
                        });
                })
                .then((user) => {
                    return createResponse(user._id, responseData)
                        .catch((error) => {
                            expect(error).to.exist;
                            expect(error.code).to.exist.and.to.equal(400);
                            expect(error.message).to.exist.and.to.equal("already-responded");
                        });
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it.skip("with already completed response for the request", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            return Profile.findOne({email: "two@test.com"}).exec()
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return createResponse(user._id, responseData)
                        .catch((error) => {
                            expect(error).to.not.exist;
                        })
                        .then((result) => {
                            expect(result.code).to.exist.and.to.equal(200);
                            expect(result.response).to.exist;
                            expect(result.response._id).to.exist;
                            const responseRef = DbManager.db.collection("responses").doc(result.response._id);
                            return responseRef.set({status: "completed"})
                                .catch((error) => {
                                    expect(error).to.not.exist;
                                });
                        })
                        .then(() => {
                            return user;
                        });
                })
                .then((user) => {
                    return createResponse(user._id, responseData)
                        .catch((error) => {
                            expect(error).to.exist;
                            expect(error.code).to.exist.and.to.equal(400);
                            expect(error.message).to.exist.and.to.equal("already-responded");
                        });
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it.skip("with already rejected response for the request", () => {
            const responseData = {
                requestId: activeRequest._id,
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            return Profile.findOne({email: "two@test.com"}).exec()
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return createResponse(user._id, responseData)
                        .catch((error) => {
                            expect(error).to.not.exist;
                        })
                        .then((result) => {
                            expect(result.code).to.exist.and.to.equal(200);
                            expect(result.response).to.exist;
                            expect(result.response._id).to.exist;
                            const responseRef = DbManager.db.collection("responses").doc(result.response._id);
                            return responseRef.set({status: "rejected"})
                                .catch((error) => {
                                    expect(error).to.not.exist;
                                });
                        })
                        .then(() => {
                            return user;
                        });
                })
                .then((user) => {
                    return createResponse(user._id, responseData)
                        .catch((error) => {
                            expect(error).to.exist;
                            expect(error.code).to.exist.and.to.equal(400);
                            expect(error.message).to.exist.and.to.equal("already-responded");
                        });
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it.skip('should pass if current response is deleted', () => {

        });
    });
});