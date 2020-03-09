const expect = require("chai").expect;
const createRequest = require("../../modules/requests/create_request");
const activateRequest = require('../../modules/requests/activate_request');
const createResponse = require("../../modules/responses/create_response");
const followUser = require('../../modules/profile/follow_user');
const unfollowUser = require('../../modules/profile/unfollow_user');
const promoteRequest = require('../../modules/requests/promote_request');
const getFeed = require("../../modules/feed/get_feed");
const moment = require('moment');

const Profile = require('../../modules/models/profile');

describe("get feed", () => {
    let activeRequest1;
    let activeRequest2;
    let activeRequest3;

    let activeResponse;
    beforeEach(() => {
        const request = {
            post: "testing post 123",
            startTime: new Date(),
            endTime: new Date(),
            locationName: "TestLocation",
            location: {coordinates: [-150, 44]},
            locationSet: true,
            points: 500,
            money: 200,
            currency: "USD",
            tags: ["test", "testing"],
            photos: ["test photo", "test photo 1"],
            unwantedText: "testing"
        };

        return createRequest("one@test.com", request)
            .then(result => {
                return activateRequest("one@test.com", result.request._id)
                    .then(() => {
                        return result;
                    });
            })
            .then((request) => {
                activeRequest1 = request.request;

                const responseData = {
                    requestId: activeRequest1._id,
                    post: "testing post 1",
                    startTime: moment().utc().valueOf(),
                    endTime: moment().utc().valueOf(),
                    locationName: "TestLocation",
                    location: {coordinates: [-150, 44]},
                    locationSet: true,
                    points: 400,
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
                        activeResponse = result.response;
                    });
            })
            .then(() => {
                const request = {
                    post: "testing post 2",
                    startTime: new Date(),
                    endTime: new Date(),
                    locationName: "TestLocation",
                    location: {coordinates: [-150, 44]},
                    locationSet: true,
                    points: 500,
                    money: 200,
                    currency: "USD",
                    tags: ["test", "testing"],
                    photos: ["test photo", "test photo 1"],
                    unwantedText: "testing"
                };

                return createRequest("one@test.com", request)
                    .then(result => {
                        return activateRequest("one@test.com", result.request._id)
                            .then(() => {
                                return result;
                            });
                    })
                    .then((result) => {
                        activeRequest2 = result.request;

                    });
            })
            .then(() => {
                const request = {
                    post: "testing post 3",
                    startTime: new Date(),
                    endTime: new Date(),
                    locationName: "TestLocation",
                    location: {coordinates: [-15, 44]},
                    locationSet: true,
                    points: 500,
                    money: 200,
                    currency: "USD",
                    tags: ["test", "testing"],
                    photos: ["test photo", "test photo 1"],
                    unwantedText: "testing"
                };

                return createRequest("two@test.com", request)
                    .then(result => {
                        return activateRequest("two@test.com", result.request._id)
                            .then(() => {
                                return result;
                            });
                    })
                    .then((result) => {
                        activeRequest3 = result.request;
                    });
            });
    });
    describe("valid", () => {
        it("get feed", () => {
            const latitude = 44;
            const longitude = -150;

            return getFeed("two@test.com", latitude, longitude)
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.code).to.exist.and.to.equal(200);
                    expect(result.results).to.exist;
                    expect(result.results.requests).to.exist.and.to.have.length(2);
                    expect(result.results.profiles).to.exist;
                });
        });
        it("get feed 2", () => {
            const latitude = -45;
            const longitude = -150;

            return getFeed("two@test.com", latitude, longitude)
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.code).to.exist.and.to.equal(200);
                    expect(result.results).to.exist;
                    expect(result.results.requests).to.exist.and.to.have.length(0);
                    expect(result.results.profiles).to.exist;
                    const feed = result.feed;
                    // expect(feed[0]._id).to.exist.and.to.equal(activeRequest3._id);
                    // expect(feed[1]._id).to.exist.and.to.equal(activeRequest2._id);
                    // expect(feed[2]._id).to.exist.and.to.equal(activeRequest1._id);
                });
        });
        it("get feed 3", () => {
            const latitude = 6.917238333333334;
            const longitude = 79.95929833333334;

            return getFeed("two@test.com", latitude, longitude)
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.code).to.exist.and.to.equal(200);
                    expect(result.results).to.exist;
                    expect(result.results.requests).to.exist.and.to.have.length(0);
                });
        });
        it("with no requests user", () => {
            const latitude = 44;
            const longitude = -150;

            return getFeed("three@test.com", latitude, longitude)
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.code).to.exist.and.to.equal(200);
                    expect(result.results).to.exist;
                    expect(result.results.requests).to.exist.and.to.have.length(2);
                });
        });
        it("only showing active requests");
        it('should show requests by following users', () => {
            const request = {
                post: "testing post 123",
                startTime: new Date(),
                endTime: new Date(),
                locationName: "TestLocation",
                location: {coordinates: [150, 44]},
                locationSet: false,
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            return createRequest("one@test.com", request)
                .then(result => {
                    expect(result.code).to.exist.and.to.equal(200);
                    return activateRequest("one@test.com", result.request._id);
                })
                .then(() => {
                    return getFeed("two@test.com", 0, 0)
                        .catch(error => {
                            expect(error).to.not.exist;
                        })
                        .then(results => {
                            expect(results).to.exist;
                            expect(results.code).to.exist.and.to.equal(200);
                            expect(results.results.requests).to.exist.and.to.have.length(0);
                        });
                })
                .then(() => {
                    return followUser("two@test.com", "one@test.com");
                })
                .then(() => {
                    return getFeed("two@test.com", 0, 0)
                        .catch(error => {
                            expect(error).to.not.exist;
                        })
                        .then(results => {
                            expect(results).to.exist;
                            expect(results.code).to.exist.and.to.equal(200);
                            expect(results.results.requests).to.exist.and.to.have.length(1);
                        });
                })
                .then(() => {
                    return getFeed("one@test.com", 0, 0)
                        .catch(error => {
                            expect(error).to.not.exist;
                        })
                        .then(results => {
                            expect(results).to.exist;
                            expect(results.code).to.exist.and.to.equal(200);
                            expect(results.results.requests).to.exist.and.to.have.length(0);
                        });
                });
        });
        it('should not show location set requests by following users', () => {
            const request = {
                post: "testing post 123",
                startTime: new Date(),
                endTime: new Date(),
                locationName: "TestLocation",
                location: {coordinates: [150, 44]},
                locationSet: true,
                points: 500,
                money: 200,
                currency: "USD",
                tags: ["test", "testing"],
                photos: ["test photo", "test photo 1"],
                unwantedText: "testing"
            };
            return createRequest("one@test.com", request)
                .then(result => {
                    expect(result.code).to.exist.and.to.equal(200);
                    return activateRequest("one@test.com", result.request._id);
                })
                .then(() => {
                    return getFeed("two@test.com", 0, 0)
                        .catch(error => {
                            expect(error).to.not.exist;
                        })
                        .then(results => {
                            expect(results).to.exist;
                            expect(results.code).to.exist.and.to.equal(200);
                            expect(results.results.requests).to.exist.and.to.have.length(0);
                        });
                })
                .then(() => {
                    return followUser("two@test.com", "one@test.com");
                })
                .then(() => {
                    return getFeed("two@test.com", 0, 0)
                        .catch(error => {
                            expect(error).to.not.exist;
                        })
                        .then(results => {
                            expect(results).to.exist;
                            expect(results.code).to.exist.and.to.equal(200);
                            expect(results.results.requests).to.exist.and.to.have.length(0);
                        });
                })
                .then(() => {
                    return getFeed("one@test.com", 0, 0)
                        .catch(error => {
                            expect(error).to.not.exist;
                        })
                        .then(results => {
                            expect(results).to.exist;
                            expect(results.code).to.exist.and.to.equal(200);
                            expect(results.results.requests).to.exist.and.to.have.length(0);
                        });
                });
        });
    });
    describe("invalid", () => {
        it.skip("user is banned", () => {
            return Profile.findById("one@test.com").exec()
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return DbManager.db.collection("Profile").update(user._id, {});
                })
                .then(() => {
                    const latitude = 44;
                    const longitude = 9;
                    return Profile.findById("one@test.com").exec()
                        .then((user) => {
                            expect(user).to.exist;
                            expect(user._id).to.exist;
                            return getFeed(user._id, latitude, longitude)
                                .catch((error) => {
                                    expect(error).to.exist;
                                    expect(error.code).to.exist.and.to.equal(400);
                                    expect(error.message).to.exist.and.to.equal("profile-not-active");
                                });
                        })
                        .then((result) => {
                            expect(result).to.not.exist;
                        });
                });
        });
        it.skip("user is deactivated", () => {
            return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
                .then(cursor => {
                    return cursor.next();
                })
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return Profile.findById(user._id).exec()
                        .then((result) => {
                            const profile = result.vertex;
                            profile.status = "deactivated";
                            return profile.save();
                        });
                })
                .then(() => {
                    const latitude = 44;
                    const longitude = 9;
                    return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
                        .then(cursor => {
                            return cursor.next();
                        })
                        .then((user) => {
                            expect(user).to.exist;
                            expect(user._id).to.exist;
                            return getFeed(user._id, latitude, longitude)
                                .catch((error) => {
                                    expect(error).to.exist;
                                    expect(error.code).to.exist.and.to.equal(400);
                                    expect(error.message).to.exist.and.to.equal("profile-not-active");
                                });
                        })
                        .then((result) => {
                            expect(result).to.not.exist;
                        });
                });
        });
        it.skip("user is new", () => {
            return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
                .then(cursor => {
                    return cursor.next();
                })
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return Profile.findById(user._id)
                        .then((profile) => {
                            profile.status = "new";
                            return profile.save();
                        });
                })
                .then(() => {
                    const latitude = 44;
                    const longitude = 9;
                    return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
                        .then(cursor => {
                            return cursor.next();
                        })
                        .then((user) => {
                            expect(user).to.exist;
                            expect(user._id).to.exist;
                            return getFeed(user._id, latitude, longitude)
                                .catch((error) => {
                                    expect(error).to.exist;
                                    expect(error.code).to.exist.and.to.equal(400);
                                    expect(error.message).to.exist.and.to.equal("profile-not-active");
                                });
                        })
                        .then((result) => {
                            expect(result).to.not.exist;
                        });
                });
        });
        it.skip("user is initialized", () => {
            return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
                .then(cursor => {
                    return cursor.next();
                })
                .then((user) => {
                    expect(user).to.exist;
                    expect(user._id).to.exist;
                    return Profile.findById(user._id).exec()
                        .then((profile) => {
                            profile.status = "initialized";
                            return profile.save();
                        });
                })
                .then(() => {
                    const latitude = 44;
                    const longitude = 9;
                    return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
                        .then(cursor => {
                            return cursor.next();
                        })
                        .then((user) => {
                            expect(user).to.exist;
                            expect(user._id).to.exist;
                            return getFeed(user._id, latitude, longitude)
                                .catch((error) => {
                                    expect(error).to.exist;
                                    expect(error.code).to.exist.and.to.equal(400);
                                    expect(error.message).to.exist.and.to.equal("profile-not-active");
                                });
                        })
                        .then((result) => {
                            expect(result).to.not.exist;
                        });
                });
        });
    });
});

