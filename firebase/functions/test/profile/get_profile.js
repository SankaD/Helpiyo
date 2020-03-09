const expect = require("chai").expect;
const getProfile = require("../../modules/profile/get_profile");
const Profile = require('../../modules/models/profile');

describe("get profile", () => {
    beforeEach(() => {
    });
    describe("valid", () => {
        it("get current user's profile", () => {
            return getProfile("one@test.com", "one@test.com")
                .catch((error) => {
                    expect(error).to.not.exist;
                })
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.code).to.exist.and.to.equal(200);
                    const profile = result.profile;
                    expect(profile).to.exist;
                    expect(profile.heroName).to.exist;
                    expect(profile.status).to.exist.and.to.equal("active");
                });
        });
        it.skip("get profile of new user", () => {

            return getProfile("one@test.com", "new@test.com")
                .catch((error) => {
                    expect(error).to.not.exist;
                })
                .then((result) => {
                    expect(result).to.exist;
                    expect(result.code).to.exist.and.to.equal(200);
                    const profile = result.profile;
                    expect(profile).to.exist;
                    expect(profile.heroName).to.exist;
                    expect(profile.status).to.exist.and.to.equal("new");
                });
        });
    });
    describe("invalid", () => {
        it("current user is banned");
        it("current user is deactivated");
        it("non existing profile", () => {
            return getProfile("one@test.com", "6b027f1f6271c25db243c14e")
                .catch((error) => {
                    expect(error).to.exist;
                    expect(error.code).to.exist.and.to.equal(Errors.profileNotFound.code);
                    expect(error.message).to.exist.and.to.equal(Errors.profileNotFound.message);
                });
        });
    });
});