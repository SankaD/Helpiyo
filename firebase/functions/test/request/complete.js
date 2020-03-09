const expect = require("chai").expect;
const createRequest = require("../../modules/requests/create_request");
const completeRequest = require("../../modules/requests/complete_request");
const createResponse = require("../../modules/responses/create_response");
const activateRequest = require("../../modules/requests/activate_request");
const activateResponse = require('../../modules/responses/activate_response');

const Request = require('../../modules/models/request');
const Response = require('../../modules/models/response');
const Profile = require('../../modules/models/profile');
const DbManager = require('../../modules/db/db_manager');

describe.only("completing request", () => {
    let currentRequest;
    let currentResponse;

    beforeEach(() => {
        let requestData = {
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
            banned: false
        };

        return createRequest("one@test.com", requestData)
            .then(result => {
                currentRequest = result.request;
                return activateRequest(currentRequest.createdBy, currentRequest._id);
            })
            .then(() => {
                requestData.requestId = currentRequest._id;
                return createResponse("two@test.com", requestData);
            })
            .then(result => {
                currentResponse = result.response;
                return activateResponse(currentResponse.createdBy, currentResponse._id);
            });
    });
    it('should fail if request not found', () => {
        return completeRequest(currentRequest.createdBy, "1affb0b0665d453d304ac908", 4, "test comment")
            .then((result) => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist.and.to.equal("active-request-not-found");
            });
    });
    it('should fail if request is deleted', () => {
        return Request.findByIdAndUpdate(currentRequest._id, {deleted: true}).exec()
            .then(() => {
                return completeRequest(currentRequest.createdBy, currentRequest._id, 4, "test comment")
                    .then(result => {
                        expect(result).to.not.exist;
                    })
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("active-request-not-found");
                    });
            });
    });
    it('should fail if user is not request creator', () => {
        return completeRequest(currentResponse.createdBy, currentRequest._id, 4, "test comment")
            .then(result => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist.and.to.equal("active-request-not-found");
            });
    });
    it.skip('should fail if user not found', () => {
        return completeRequest("testuser", currentRequest._id, 4, "test comment")
            .then(result => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist;
                expect(error.code).to.exist.and.to.equal(Errors.profileNotFound.code);
                expect(error.message).to.exist.and.to.equal(Errors.profileNotFound.message);
            });
    });
    it('should fail if request status is completed', () => {
        return completeRequest(currentRequest.createdBy, currentRequest._id, 4, "test comment")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(() => {
                return completeRequest(currentRequest.createdBy, currentRequest._id, 4, "test comment")
                    .then(result => {
                        expect(result).to.not.exist;
                    })
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("active-request-not-found");
                    });
            });
    });
    it('should fail if request status is draft', () => {
        return Request.findByIdAndUpdate(currentRequest._id, {status: "draft"}).exec()
            .then(() => {
                return completeRequest(currentRequest.createdBy, currentRequest._id, 4, "test comment")
                    .then(result => {
                        expect(result).to.not.exist;
                    })
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("active-request-not-found");
                    });
            });
    });
    it.skip('should fail if request status is processed', () => {

        return Request.findByIdAndUpdate(currentRequest._id, {status: "processing"}).exec()
            .then(() => {
                return completeRequest(currentRequest.createdBy, currentRequest._id, 4, "test comment")
                    .then(result => {
                        expect(result).to.not.exist;
                    })
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("active-request-not-found");
                    });
            });
    });
    it('should pass without any responses', () => {
        let requestData = {
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
            banned: false
        };
        let requestId;
        return createRequest(currentRequest.createdBy, requestData)
            .then(result => {
                requestId = result.request._id;
                return activateRequest(result.request.createdBy, result.request._id);
            })
            .then(() => {
                return completeRequest(currentRequest.createdBy, requestId, 4, "test comment");
            });
    });

    it.only('should complete response when response is accepted', () => {
        return Response.findByIdAndUpdate(currentResponse._id, {status: "accepted"}).exec()
            .then(() => {
                return completeRequest(currentRequest.createdBy, currentRequest._id, 4, "test comment")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                return Response.findById(currentResponse._id).exec();
            })
            .then(response => {
                expect(response).to.exist;
                expect(response.status).to.exist.and.to.equal("completed");
            });
    });
    it('should reject response when response is active', () => {
        return Response.findByIdAndUpdate(currentResponse._id, {status: "active"}).exec()
            .then(() => {
                return completeRequest(currentRequest.createdBy, currentRequest._id, 4, "test comment")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                return Response.findById(currentResponse._id).exec();
            })
            .then(response => {
                expect(response).to.exist;
                expect(response.status).to.exist.and.to.equal("completed");
                expect(response.resolution).to.exist.and.to.equal("ignored");
            });
    });
    it.skip('should rate response if response is not rated', () => {
        return Response.findByIdAndUpdate(currentResponse._id, {status: "accepted"}).exec()
            .then(() => {
                return completeRequest(currentRequest.createdBy, currentRequest._id, 4, "test comment")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                return Response.findById(currentResponse._id);
            })
            .then(response => {
                expect(response).to.exist;
                expect(response.status).to.exist.and.to.equal("completed");
                expect(response.requesterRatingValue).to.exist.and.to.equal(4);
                expect(response.requesterRatingComment).to.not.exist;
            });
    });
    it.skip('should not rate response if response is rated', () => {
        return Response.findById(currentResponse._id).exec()
            .then(response => {
                response.status = "accepted";
                response.requesterRatingValue = 3;
                return response.save();
            })
            .then(() => {
                return completeRequest(currentRequest.createdBy, currentRequest._id, 4, "test comment")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                return Response.findById(currentResponse._id).exec();
            })
            .then(response => {
                expect(response).to.exist;
                expect(response.status).to.exist.and.to.equal("completed");
                expect(response.requesterRatingValue).to.exist.and.to.equal(3);
                expect(response.requesterRatingComment).to.not.exist;
            });
    });
    it('should pass if response is deleted', () => {
        return Response.findByIdAndUpdate(currentResponse._id, {deleted: true}).exec()
            .then(() => {
                return completeRequest(currentRequest.createdBy, currentRequest._id, 4, "test comment")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            });
    });
    it('should pass if response is rejected', () => {
        return Response.findByIdAndUpdate(currentResponse._id, {status: "rejected"}).exec()
            .then(() => {
                return completeRequest(currentRequest.createdBy, currentRequest._id, 4, "test comment")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            });
    });
    it('should pass if response is draft', () => {
        return Response.findByIdAndUpdate(currentResponse._id, {status: "draft"}).exec()
            .then(() => {
                return completeRequest(currentRequest.createdBy, currentRequest._id, 4, "test comment")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            });
    });
    it('should fail if rating is negative', () => {
        return completeRequest(currentRequest.createdBy, currentRequest._id, -4, "test comment")
            .then(result => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist;
                // expect(error).to.equal("validation-failure");
            });
    });
    it('should fail if rating is greater than 5', () => {
        return completeRequest(currentRequest.createdBy, currentRequest._id, 14, "test comment")
            .then(result => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist;
                // expect(error).to.equal("validation-failure");
            });
    });
    it('should fail if rating is 0', () => {
        return completeRequest(currentRequest.createdBy, currentRequest._id, 0, "test comment")
            .then(result => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist;
                // expect(error).to.equal("validation-failure");
            });
    });
    it.skip('should fail if rating comment is too long', () => {
        return completeRequest(currentRequest.createdBy, currentRequest._id, 4, "test comment asda ads asd asd asda sd asd asda sda sda sdas das dasd asd asd asda sda sda sda sdas da sdas das das d")
            .then(result => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist;
                expect(error).to.equal("validation-failure");
            });
    });
    describe.skip('with multiple responses', () => {
        it('should complete responses when all the responses are accepted', () => {

        });
        it('should reject responses when all responses are active', () => {

        });
        it('should rate unrated responses', () => {

        });
        it('should not rate rated responses', () => {

        });
    });
});