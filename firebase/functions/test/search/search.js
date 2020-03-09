const expect = require('chai').expect;

const search = require('../../modules/search/search');
const createRequest = require("../../modules/requests/create_request");
const activateRequest = require("../../modules/requests/activate_request");

const DbManager = require('../../modules/db/db_manager');

describe('search', () => {
    let userId1;
    let userId2;
    let requestId;
    beforeEach(() => {
        const request = {
            post: "testing post 123 two",
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
            .then(result => {
                requestId = result.request._id;
                return activateRequest("one@test.com", result.request._id);
            });
    });
    it('should return profiles for hero name', () => {
        return search("one@test.com", "one", 10, "profile")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result1 => {
                expect(result1.code).to.exist.and.to.equal(200);
                const result = result1.results;
                expect(result).to.exist;
                expect(result.profiles).to.exist.and.to.have.length(1);
                expect(result.requests).to.exist;
                expect(result.requests.requests).to.exist.and.to.have.length(0);
                let profile = result.profiles[0];
                expect(profile).to.exist;
                expect(profile._id).to.exist.and.to.equal("one@test.com");
                expect(profile.modifiedOn).to.exist;
                expect(profile.heroName).to.exist;
            });
    });
    it('should return requests for description', () => {
        return search("one@test.com", "two", 10, "request")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result1 => {
                expect(result1.code).to.exist.and.to.equal(200);
                const result = result1.results;
                expect(result).to.exist;
                expect(result.profiles).to.exist.and.to.have.length(0);
                expect(result.requests).to.exist;
                expect(result.requests.requests).to.exist.and.to.have.length(1);
                let request = result.requests.requests[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(requestId);
                expect(request.modifiedOn).to.exist;
                expect(request.post).to.exist;
            });
    });
    it('should return empty if no results found', () => {
        return search("one@test.com", "non existing", 10, "global")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result1 => {
                expect(result1.code).to.exist.and.to.equal(200);
                const result = result1.results;
                expect(result).to.exist;
                expect(result.profiles).to.exist.and.to.have.length(0);
                expect(result.requests.requests).to.exist.and.to.have.length(0);
            });
    });
    it('should return results for multiple words', () => {
        return search("one@test.com", "testing two", 10, "request")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result1 => {
                expect(result1.code).to.exist.and.to.equal(200);
                const result = result1.results;
                expect(result).to.exist;
                expect(result.profiles).to.exist.and.to.have.length(0);
                expect(result.requests.requests).to.exist.and.to.have.length(1);
                let request = result.requests.requests[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(requestId);
                expect(request.modifiedOn).to.exist;
                expect(request.post).to.exist;
            });
    });
    it('should return results for profile search', () => {
        return search("one@test.com", "two", 10, "profile")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result1 => {
                expect(result1.code).to.exist.and.to.equal(200);
                const result = result1.results;
                expect(result).to.exist;
                expect(result.profiles).to.exist.and.to.have.length(1);
                expect(result.requests.requests).to.exist.and.to.have.length(0);
                let profile = result.profiles[0];
                expect(profile).to.exist;
                expect(profile._id).to.exist.and.to.equal("two@test.com");

            });
    });
    it('should return results for request search', () => {
        return search("one@test.com", "two", 10, "request")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result1 => {
                expect(result1.code).to.exist.and.to.equal(200);
                const result = result1.results;
                expect(result).to.exist;
                expect(result.profiles).to.exist.and.to.have.length(0);
                expect(result.requests.requests).to.exist.and.to.have.length(1);
                let request = result.requests.requests[0];
                expect(request).to.exist;
                expect(request._id).to.exist.and.to.equal(requestId);
                expect(request.modifiedOn).to.exist;
                expect(request.post).to.exist;
            });
    });
});