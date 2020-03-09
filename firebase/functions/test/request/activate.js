const expect = require('chai').expect;
const activateRequest = require('../../modules/requests/activate_request');
const createRequest = require('../../modules/requests/create_request');
const Request = require('../../modules/models/request');
const Profile = require('../../modules/models/profile');
const DbManager = require('../../modules/db/db_manager');

describe('activate request', () => {
    let currentRequestId;
    beforeEach(() => {
        const requestData = {
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

        return createRequest("one@test.com", requestData)
            .then((result) => {
                currentRequestId = result.request._id;
            });
    });
    it("should pass for draft request", () => {
        return activateRequest("one@test.com", currentRequestId)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then((result) => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.request).to.exist;
                expect(result.request._id).to.exist.and.to.deep.eq(currentRequestId);
                expect(result.request.status).to.exist.and.to.equal("active");
            });
    });
    it('should fail for active request', () => {
        return Request.findByIdAndUpdate(currentRequestId, {status: "active"}).exec()
            .then(() => {
                return activateRequest("one@test.com", currentRequestId);
            })
            .catch((error) => {
                expect(error).to.exist.and.to.equal("active-request-not-found");
            });
    });
    it('should fail for non existing request', () => {
        return activateRequest("one@test.com", "asdasdasdasd")
            .then((result) => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist.and.to.equal("active-request-not-found");
            });

    });
    it('should fail for deleted request', () => {
        return Request.findByIdAndUpdate(currentRequestId, {deleted: true}).exec()
            .then(() => {
                return activateRequest("one@test.com", currentRequestId);
            })
            .then((result) => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist.and.to.equal("active-request-not-found");
            });
    });
    it('should fail when user is not request creator', () => {
        return activateRequest("two@test.com", currentRequestId)
            .then(result => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist.and.to.equal("active-request-not-found");
            });
    });
});