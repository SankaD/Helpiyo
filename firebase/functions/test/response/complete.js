const expect = require("chai").expect;
const moment = require('moment');
const completeResponse = require("../../modules/responses/complete_response");
const createResponse = require("../../modules/responses/create_response");
const createRequest = require("../../modules/requests/create_request");
const acceptResponse = require("../../modules/responses/accept_response");
const activateRequest = require('../../modules/requests/activate_request');
const activateResponse = require('../../modules/responses/activate_response');
const Response = require('../../modules/models/response');
const Profile = require('../../modules/models/profile');
const DbManager = require('../../modules/db/db_manager');

describe("complete response", () => {
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
            .then(result => {
                activeRequest = result.request;
                return activateRequest("one@test.com", activeRequest._id);
            })
            .then((request) => {
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

                return createResponse("two@test.com", responseData);
            })
            .then((result) => {
                expect(result).to.exist;
                activeResponse = result.response;
                return activateResponse("two@test.com", activeResponse._id);
            });
    });
    describe("valid", () => {
        it("complete response", () => {
            return acceptResponse("one@test.com", activeResponse._id)
                .catch(error => {
                    expect(error).to.not.exist;
                })
                .then(() => {
                    return completeResponse("two@test.com", activeResponse._id, 5, "test comment")
                        .catch(error => {
                            expect(error).to.not.exist;
                        });
                })
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.code).to.exist.and.to.equal(200);
                })
                .then(() => {
                    return Response.findById(activeResponse._id).exec()
                        .catch(error => {
                            expect(error).to.not.exist;
                        });
                })
                .then(response => {
                    expect(response).to.exist;
                    expect(response.status).to.exist.and.to.equal("completed");
                });
        });

    });
    describe("invalid", () => {
        it("current user not created response", () => {
            return acceptResponse("one@test.com", activeResponse._id)
                .catch(error => {
                    expect(error).to.not.exist;
                })
                .then(() => {

                    return completeResponse("one@test.com", activeResponse._id, 5, "test comment")
                        .then((result) => {
                            expect(result).to.not.exist;
                        })
                        .catch(error => {
                            expect(error).to.exist.and.to.equal("active-response-not-found");
                        });
                });
        });
        it("banned response creator");
        it("deactivated response creator");
        it("banned request creator");
        it("deactivated request creator");
        it.skip("response status banned", () => {
            return acceptResponse("one@test.com", activeResponse._id)
                .then(() => {
                    return DbManager.db.collection("Response").update(activeResponse._id).exec();
                })
                .then(response => {
                    expect(response).to.exist;
                    response.banned = true;
                    return response.save();
                })
                .then(() => {
                    return completeResponse("two@test.com", activeResponse._id, 5, "test comment")
                        .then(result => {
                            expect(result).to.not.exist;
                        })
                        .catch(error => {
                            expect(error).to.exist.and.to.equal("response-not-found");
                        });
                });
        });
        it("response status completed", () => {
            return Response.update({_id: activeResponse._id}, {status: "completed"})
                .then(() => {
                    return completeResponse("two@test.com", activeResponse._id, 5, "test comment")
                        .then(result => {
                            expect(result).to.not.exist;
                        })
                        .catch(error => {
                            expect(error).to.exist.and.to.equal("active-response-not-found");
                        });
                });
        });

        it("response status active", () => {
            return Response.update({_id: activeResponse._id}, {status: "active"})
                .then(() => {
                    return completeResponse("two@test.com", activeResponse._id, 5, "test comment")
                        .then(result => {
                            expect(result).to.not.exist;
                        })
                        .catch(error => {
                            expect(error).to.exist.and.to.equal("active-response-not-found");
                        });
                });
        });
        it("response status deleted", () => {
            return acceptResponse("one@test.com", activeResponse._id)
                .then(() => {
                    return Response.update({_id: activeResponse._id}, {deleted: true});
                })
                .then(() => {
                    return completeResponse("two@test.com", activeResponse._id, 5, "test comment")
                        .then(result => {
                            expect(result).to.not.exist;
                        })
                        .catch(error => {
                            expect(error).to.exist.and.to.equal("active-response-not-found");
                        });
                });
        });
        it("request status completed");
        it("request status processing");
        it("request status deleted");
        it("with a negative rating", () => {
            return acceptResponse("one@test.com", activeResponse._id)
                .catch(error => {
                    expect(error).to.not.exist;
                })
                .then(() => {

                    return completeResponse("two@test.com", activeResponse._id, -5, "test comment")
                        .then(result => {
                            expect(result).to.not.exist;
                        })
                        .catch(error => {
                            expect(error).to.exist.and.to.equal("validation-failure");
                        });
                });
        });
        it("with a zero rating", () => {
            return acceptResponse("one@test.com", activeResponse._id)
                .catch(error => {
                    expect(error).to.not.exist;
                })
                .then(() => {

                    return completeResponse("two@test.com", activeResponse._id, 0, "test comment")
                        .then(result => {
                            expect(result).to.not.exist;
                        })
                        .catch(error => {
                            expect(error).to.exist.and.to.equal("validation-failure");
                        });
                });
        });
        it("with non integer rating", () => {
            return acceptResponse("one@test.com", activeResponse._id)
                .catch(error => {
                    expect(error).to.not.exist;
                })
                .then(() => {

                    return completeResponse("two@test.com", activeResponse._id, 2.5, "test comment")
                        .then(result => {
                            expect(result).to.not.exist;
                        })
                        .catch(error => {
                            expect(error).to.exist.and.to.equal("validation-failure");
                        });
                });
        });
        it("with larger then 5 rating", () => {
            return acceptResponse("one@test.com", activeResponse._id)
                .catch(error => {
                    expect(error).to.not.exist;
                })
                .then(() => {

                    return completeResponse("two@test.com", activeResponse._id, 25, "test comment")
                        .then(result => {
                            expect(result).to.not.exist;
                        })
                        .catch(error => {
                            expect(error).to.exist.and.to.equal("validation-failure");
                        });
                });
        });
        it.skip("with long rating comment", () => {
            return acceptResponse("one@test.com", activeResponse._id)
                .catch(error => {
                    expect(error).to.not.exist;
                })
                .then(() => {

                    return completeResponse("two@test.com", activeResponse._id, 4, "test comment asd asda sda sdas dasd asa sdas dasda sdas das dasd asda sda sda sdas das dasd asd asda sda sda sda")
                        .then(result => {
                            expect(result).to.not.exist;
                        })
                        .catch(error => {
                            expect(error).to.exist.and.to.equal("validation-failure");
                        });
                });
        });
    });
});