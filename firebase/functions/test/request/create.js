const expect = require("chai").expect;
const createRequest = require("../../modules/requests/create_request");
const DbManager = require('../../modules/db/db_manager');
const Utils = require('../../modules/utils/index');
const Request = require('../../modules/models/request');
const Profile = require('../../modules/models/profile');
const moment = require('moment');

describe("create request", () => {
    describe("valid", () => {
        it("create request", () => {
            const request = {
                post: "testing post 123",
                startTime: new Date(),
                endTime: new Date(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.not.exist;
                })
                .then((result) => {
                    expect(result).to.exist;
                    const request2 = result.request;
                    expect(request2).to.exist;
                    expect(request2.createdBy).to.exist.and.to.equal("one@test.com");
                    expect(request2.post).to.exist.and.to.equal(request.post);
                    expect(request2.startTime).to.exist;
                    expect(request2.endTime).to.exist;
                    expect(request2.locationName).to.exist.and.to.equal(request.locationName);
                    // expect(request2.location).to.exist.and.to.equal(request.location);
                    expect(request2.locationSet).to.exist.and.to.equal(request.locationSet);
                    expect(request2.money).to.exist.and.to.equal(request.money);
                    expect(request2.currency).to.exist.and.to.equal(request.currency);
                    expect(request2.photos).to.exist.and.to.eql(request.photos);
                    expect(request2.tags).to.exist.and.to.eql(request.tags);
                    expect(request2.unwantedText).to.not.exist;
                    return request2;
                })
                .then((request) => {
                    return Request.findById(request._id).exec();
                })
                .then((request2) => {
                    expect(request2).to.exist;
                    expect(request2.status).to.exist.and.to.equal("draft");
                    expect(request2.startTime).to.exist;
                    expect(request2.endTime).to.exist;
                    expect(request2.locationName).to.exist.and.to.equal(request.locationName);
                    // expect(request2.latitude).to.exist.and.to.equal(request.latitude);
                    // expect(request2.longitude).to.exist.and.to.equal(request.longitude);
                    expect(request2.money).to.exist.and.to.equal(request.money);
                    expect(request2.currency).to.exist.and.to.equal(request.currency);
                    expect(request2.photos).to.exist.and.to.eql(request.photos);
                    expect(request2.tags).to.exist.and.to.eql(request.tags);
                    expect(request2.unwantedText).to.not.exist;
                });
        });
        it("without location", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: false,
                // latitude: 40,
                // longitude: 5,
                points: 10,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.not.exist;
                })
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.request).to.exist;
                    expect(result.request.createdBy).to.exist.and.to.equal("one@test.com");
                    expect(result.request.locationSet).to.exist.and.to.equal(false);
                    return result.request;
                })
                .then((request) => {
                    return Request.findById(request._id).exec();
                })
                .then(request => {
                    expect(request).to.exist;
                    return request;
                })
                .then((request) => {
                    expect(request.status).to.exist.and.to.equal("draft");
                });
        });
        it("without media files", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"]
                // photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.not.exist;
                })
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.request).to.exist;
                    expect(result.request.createdBy).to.exist.and.to.equal("one@test.com");
                    expect(result.request.photos).to.exist.and.to.have.length(0);
                    return result.request;
                })
                .then((request) => {
                    return Request.findById(request._id).exec();
                })
                .then((request) => {
                    expect(request).to.exist;
                    expect(request.status).to.exist.and.to.equal("draft");
                    expect(request.photos).to.exist.and.to.have.length(0);
                });
        });
        it("without end time", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                // endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.not.exist;
                })
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.request).to.exist;
                    expect(result.request.createdBy).to.exist.and.to.equal("one@test.com");
                    expect(result.request.endTime).to.not.exist;
                    return result.request;
                })
                .then((request) => {
                    return Request.findById(request._id).exec();
                })
                .then((request) => {
                    expect(request).to.exist;
                    expect(request.status).to.exist.and.to.equal("draft");
                    expect(request.endTime).to.not.exist;
                });
        });
        it("without money payment", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                // money: 200,
                // currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.not.exist;
                })
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.request).to.exist;
                    expect(result.request.createdBy).to.exist.and.to.equal("one@test.com");
                    expect(result.request.money).to.not.exist;
                    return result.request;
                })
                .then((request) => {
                    return Request.findById(request._id).exec();
                })
                .then((request) => {

                    expect(request).to.exist;
                    expect(request.status).to.exist.and.to.equal("draft");
                    expect(request.money).to.not.exist;
                });
        });
        it("with real payment 0", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: 0,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.not.exist;
                })
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.request).to.exist;
                    expect(result.request.createdBy).to.exist.and.to.equal("one@test.com");
                    expect(result.request.money).to.exist.and.to.equal(0);
                    return result.request;
                })
                .then((request) => {
                    return Request.findById(request._id).exec();
                })
                .then((request) => {

                    expect(request).to.exist;
                    expect(request.status).to.exist.and.to.equal("draft");
                    expect(request.money).to.exist.and.to.equal(0);
                });
        });
        it("for multiple responses");
    });
    describe.skip("invalid", () => {
        it("without post", () => {
            const request = {
                // post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: 0,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it.skip("without points amount", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                // points: 10,
                money: 0,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("without start time", () => {
            const request = {
                post: "testing post 123",
                // startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: 0,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("with location name without coordinates", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                // location: {coordinates: [5, 40]},
                points: 10,
                money: 0,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("with latitude, without longitude", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [undefined, 40]},
                points: 10,
                money: 0,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("with longitude, without latitude", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, undefined]},
                points: 10,
                money: 0,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("with a short post", () => {
            const request = {
                post: "test",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: 0,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it.skip("with points amount == 0", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 0,
                money: 0,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("with currency not set and real amount set", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: 200,
                // currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("end time earlier than start time", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf() + 1000,
                endTime: moment().utc().valueOf(),
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: 0,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("with long post", () => {
            const request = {
                post: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc congue ex vel tellus dignissim, sed laoreet tortor dictum. Vestibulum ante sapien, viverra a sodales et, fringilla pharetra augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus porttitor vehicula dictum. Aliquam viverra velit ornare, tincidunt mi at, mollis velit. Integer tempus non erat vel iaculis. Vivamus a sollicitudin arcu, vitae facilisis sem. Vivamus at sagittis nisi massa nunc afsdf sd fsd sfd s.",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: 0,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("long location name", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc congue ex vel tellus dignissim, sed laoreet tortor dictum. Vestibulum ante sapien, viverra a sodales et, fringilla pharetra augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus porttitor vehicula dictum. Aliquam viverra velit ornare, tincidunt mi at, mollis velit. Integer tempus non erat vel iaculis. Vivamus a sollicitudin arcu, vitae facilisis sem. Vivamus at sagittis nisi massa nunc.",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it.skip("floating point, point value", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10.53,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;
            return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
                .then(cursor => {
                    return cursor.next();
                })
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    creator = user;
                    return createRequest(user._id, request);
                })
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it.skip("string point value", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: "abc",
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;
            return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
                .then(cursor => {
                    return cursor.next();
                })
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    creator = user;
                    return createRequest(user._id, request);
                })
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("string money value", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: "sdfA",
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("long currency", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: 200,
                currency: "USDA",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("short currency", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: 200,
                currency: "US",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;

            return createRequest("one@test.com", request)
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("validation-failure");
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it.skip("new user", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            let creator;
            return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "new@test.com"})
                .then(cursor => {
                    return cursor.next();
                })
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    creator = user;
                    return createRequest(user._id, request);
                })
                .catch((error) => {
                    expect(error).to.exist;
                    expect(error.code).to.exist.and.to.equal(Errors.profileNotActive.code);
                    expect(error.message).to.exist.and.to.equal(Errors.profileNotActive.message);
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
        it("banned user");
        it("deactivated user");
        it.skip("non existing user", () => {
            const request = {
                post: "testing post 123",
                startTime: moment().utc().valueOf(),
                endTime: moment().utc().valueOf() + 1000,
                locationName: "TestLocation",
                locationSet: true,
                location: {coordinates: [5, 40]},
                points: 10,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"]
            };
            return createRequest("1affb0b0665d453d304ac908", request)
                .catch((error) => {
                    expect(error).to.exist;
                    expect(error.code).to.exist.and.to.equal(Errors.profileNotFound.code);
                    expect(error.message).to.exist.and.to.equal(Errors.profileNotFound.message);
                })
                .then((result) => {
                    expect(result).to.not.exist;
                });
        });
    });
});