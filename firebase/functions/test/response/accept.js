const expect = require("chai").expect;
const moment = require('moment');

const createResponse = require("../../modules/responses/create_response");
const createRequest = require("../../modules/requests/create_request");
const acceptResponse = require("../../modules/responses/accept_response");
const activateResponse = require('../../modules/responses/activate_response');
const activateRequest = require('../../modules/requests/activate_request');

const Response = require('../../modules/models/response');
const Profile = require('../../modules/models/profile');
const DbManager = require('../../modules/db/db_manager');

describe("accept response", () => {
    let activeRequest;
    let activeResponse;
    beforeEach(() => {
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

        return createRequest("one@test.com", request)
            .then(request => {
                activeRequest = request.request;
                return activateRequest("one@test.com", activeRequest._id);
            })
            .then(() => {
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
                return activateResponse("two@test.com", activeResponse._id);
            });
    });
    describe("valid", () => {
        it("accept response", () => {
            return acceptResponse("one@test.com", activeResponse._id)
                .catch(error => {
                    expect(error).to.not.exist;
                })
                .then(result => {
                    expect(result).to.exist;
                    expect(result.code).to.exist.and.to.equal(200);
                });
        });
        it("response status = rejected", () => {
            return Response.update({_id: activeResponse._id}, {status: "rejected"}).exec()
                .then(() => {
                    return acceptResponse("one@test.com", activeResponse._id)
                        .catch(error => {
                            expect(error).to.not.exist;
                        })
                        .then(result => {
                            expect(result).to.exist;
                            expect(result.code).to.exist.and.to.equal(200);
                        });

                });
        });
    });
    describe("invalid", () => {
        it("user have not enough funds");
        it("user not created the request", () => {

            return acceptResponse("two@test.com", activeResponse._id)
                .then((result) => {
                    expect(result).to.not.exist;
                })
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("request-not-found");
                });
        });
        it.skip("not existing response", () => {

            return acceptResponse("one@test.com", "6b0011963e6d4a592c9c9414")
                .then((result) => {
                    expect(result).to.not.exist;
                })
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("request-not-found");
                });
        });
        it.skip("not existing user", () => {
            return acceptResponse("5b02dc915385694d9c57f337", activeResponse._id)
                .then((result) => {
                    expect(result).to.not.exist;
                })
                .catch((error) => {
                    expect(error).to.exist.and.to.equal("request-not-found");
                });
        });
        it("response is deleted", () => {
            return Response.update({_id: activeResponse._id}, {deleted: true}).exec()
                .then(() => {
                    return acceptResponse("one@test.com", activeResponse._id)
                        .then((result) => {
                            expect(result).to.not.exist;
                        })
                        .catch((error) => {
                            expect(error).to.exist.and.to.equal("active-response-not-found");
                        });
                });
        });
        it("response status = completed", () => {
            return Response.update({_id: activeResponse._id}, {status: "completed"}).exec()
                .then(() => {
                    return acceptResponse("one@test.com", activeResponse._id)
                        .then((result) => {
                            expect(result).to.not.exist;
                        })
                        .catch((error) => {
                            expect(error).to.exist.and.to.equal("active-response-not-found");
                        });
                });
        });
        it("response status = accepted", () => {
            return Response.update({_id: activeResponse._id}, {status: "accepted"}).exec()
                .then(() => {

                    return acceptResponse("one@test.com", activeResponse._id)
                        .then((result) => {
                            expect(result).to.not.exist;
                        })
                        .catch((error) => {
                            expect(error).to.exist.and.to.equal("active-response-not-found");
                        });
                });
        });
        it("response status = processing", () => {
            return Response.update({_id: activeResponse._id}, {status: "processing"}).exec()
                .then(() => {
                    return acceptResponse("one@test.com", activeResponse._id)
                        .then((result) => {
                            expect(result).to.not.exist;
                        })
                        .catch((error) => {
                            expect(error).to.exist.and.to.equal("active-response-not-found");
                        });
                });
        });
        it.skip("response status = banned", () => {
            return Response.findById(activeResponse._id).exec()
                .then((result) => {
                    result.banned = true;
                    return result.save();
                })
                .then(() => {
                    return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
                        .then(cursor => {
                            return cursor.next();
                        })
                        .then((user) => {
                            expect(user).to.exist;

                            return acceptResponse("one@test.com", activeResponse._id)
                                .then((result) => {
                                    expect(result).to.not.exist;
                                })
                                .catch((error) => {
                                    expect(error).to.exist;
                                    expect(error.code).to.exist.and.to.equal(Errors.responseNotFound.code);
                                    expect(error.message).to.exist.and.to.equal(Errors.responseNotFound.message);
                                });
                        });
                });
        });

        it.skip("banned response creator", () => {
            return Profile.findOne({email: "two@test.com"}).exec()
                .then((user) => {
                    return Profile.findById("two@test.com").exec()
                        .then((profile) => {
                            profile.vertex.status = "banned";
                            return profile.save()
                                .then(() => {
                                    return Profile.findOne({_id: "one@test.com"}).exec();
                                });
                        })
                        .catch((error) => {
                            expect(error).to.not.exist;
                        });
                })
                .then((user) => {
                    expect(user).to.exist;
                    return acceptResponse("one@test.com", activeResponse._id)
                        .then((result) => {
                            expect(result).to.not.exist;
                        })
                        .catch((error) => {
                            expect(error).to.exist;
                            expect(error.code).to.exist.and.to.equal(400);
                            expect(error.message).to.exist.and.to.equal("response-creator-not-active");
                        });
                });
        });
        it("deactivated response creator");
        it("banned request creator");
        it("deactivated request creator");
        it("max response count reached");
    });
});