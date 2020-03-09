const expect = require("chai").expect;
const createRequest = require("../../modules/requests/create_request");
const editRequest = require('../../modules/requests/edit_request');
const activateRequest = require('../../modules/requests/activate_request');
const Request = require('../../modules/models/request');
const Profile = require('../../modules/models/profile');

const DbManager = require('../../modules/db/db_manager');

describe('editing request', () => {
    let request;
    let requestCreatorId;
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
        unwantedText: "testing"
    };
    beforeEach(() => {
        return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
            .then(cursor => {
                return cursor.next();
            })
            .then((user) => {
                requestCreatorId = user._id;
                return createRequest(user._id, requestData);
            })
            .then(result => {
                request = result.request;
                return activateRequest(requestCreatorId, request._id);
            });
    });

    it('should pass with correct values', () => {
        request.post = "testing post 2 123";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = 80;
        request.longitude = 10;
        request.points = 1000;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];

        return editRequest(requestCreatorId, request)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.requestId).to.exist.and.to.equal(request._id);
            });
    });
    it('should fail if post is empty', () => {
        request.post = "";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = 80;
        request.longitude = 10;
        request.points = 1000;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];

        return editRequest(requestCreatorId, request)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if post length is too low', () => {
        request.post = "123";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = 80;
        request.longitude = 10;
        request.points = 1000;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];

        return editRequest(requestCreatorId, request)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if post length is too high', () => {
        request.post = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc congue ex vel tellus dignissim, sed laoreet tortor dictum. Vestibulum ante sapien, viverra a sodales et, fringilla pharetra augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus porttitor vehicula dictum. Aliquam viverra velit ornare, tincidunt mi at, mollis velit. Integer tempus non erat vel iaculis. Vivamus a sollicitudin arcu, vitae facilisis sem. Vivamus at sagittis nisi massa nunc afsdf sd fsd sfd s.";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = 80;
        request.longitude = 10;
        request.points = 1000;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];

        return editRequest(requestCreatorId, request)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if only latitude is provided', () => {
        request.post = "testing post 2 123";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = 80;
        request.longitude = undefined;
        request.points = 1000;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];

        return editRequest(requestCreatorId, request)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if only longitude is provided', () => {
        request.post = "testing post 2 123";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = undefined;
        request.longitude = 10;
        request.points = 1000;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];

        return editRequest(requestCreatorId, request)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should pass if location is not provided', () => {
        request.post = "testing post 2 123";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = undefined;
        request.longitude = undefined;
        request.points = 1000;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];

        return editRequest(requestCreatorId, request)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if end time is less than start time', () => {
        request.post = "testing post 2 123";
        request.startTime = new Date();
        // request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = 80;
        request.longitude = 10;
        request.points = 1000;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];

        return editRequest(requestCreatorId, request)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if points amount is 0', () => {
        request.post = "testing post 2 123";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = 80;
        request.longitude = 10;
        request.points = 0;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];

        return editRequest(requestCreatorId, request)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if money is provided without currency', () => {
        request.post = "testing post 2 123";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = 80;
        request.longitude = 10;
        request.points = 1000;
        request.money = 300;
        request.currency = undefined;
        request.tags = ["test 2", "tag 2", "testing"];

        return editRequest(requestCreatorId, request)
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if request status is completed', () => {
        request.post = "testing post 2 123";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = 80;
        request.longitude = 10;
        request.points = 1000;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];

        return DbManager.db.collection("Request").update(request._id, {status: "completed"})
            .then(() => {
                return editRequest(requestCreatorId, request)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("request-not-found");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it.skip('should fail if request status is processing', () => {
        request.post = "testing post 2 123";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = 80;
        request.longitude = 10;
        request.points = 1000;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];

        return Request.findById(request._id).exec()
            .then(request => {
                request.status = "processing";
                return request.save();
            })
            .then(() => {
                return editRequest(requestCreatorId, request)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("already-completed");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if request is deleted', () => {
        request.post = "testing post 2 123";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = 80;
        request.longitude = 10;
        request.points = 1000;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];

        return DbManager.db.collection("Request").update(request._id, {deleted: true})
            .then(() => {
                return editRequest(requestCreatorId, request)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("request-not-found");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if request is not found', () => {
        request.post = "testing post 2 123";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = 80;
        request.longitude = 10;
        request.points = 1000;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];
        request._id = "1affb0b0665d453d304ac908";

        return editRequest(requestCreatorId, request)
            .catch(error => {
                expect(error).to.exist.and.to.equal("request-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if request status is draft', () => {
        request.post = "testing post 2 123";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = 80;
        request.longitude = 10;
        request.points = 1000;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];

        return DbManager.db.collection("Request").update(request._id, {status: "draft"})
            .then(() => {
                return editRequest(requestCreatorId, request)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("request-not-found");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it.skip('should fail if request is banned', () => {
        request.post = "testing post 2 123";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = 80;
        request.longitude = 10;
        request.points = 1000;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];

        return DbManager.db.collection("Request").update(request._id)
            .then(request => {
                request.banned = true;
                return request.save();
            })
            .then(() => {
                return editRequest(requestCreatorId, request)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("request-not-found");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if not request creator', () => {
        request.post = "testing post 2 123";
        request.startTime = new Date();
        request.endTime = new Date();
        request.locationName = "Colombo 2";
        request.latitude = 80;
        request.longitude = 10;
        request.points = 1000;
        request.money = 300;
        request.currency = "LKR";
        request.tags = ["test 2", "tag 2", "testing"];

        return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
            .then(cursor => {
                return cursor.next();
            })
            .then(profile => {
                return editRequest(profile._id, request)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("request-not-found");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it("should not change status if status is updated");
});