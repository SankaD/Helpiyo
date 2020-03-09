const createProfile = require("../../modules/profile/register");
const getProfile = require('../../modules/profile/get_profile');
const expect = require("chai").expect;
const Profile = require('../../modules/models/profile');

describe("creating profile", () => {
    beforeEach(() => {
    });

    it("creating profile", () => {
        const data = {
            _id: "test.profile.0@test.com",
            password: "Password@123",
            phoneNumber: "123123123",
            heroName: "Testing"
        };
        let userId;
        return createProfile(data)
            .then((result) => {
                expect(result.code).to.equal(200);
                expect(result.profileId).to.exist.and.be.string;
                return result.profileId;
            })
            .then((userId) => {
                // check database
                return getProfile(userId, userId)
                    .then((result) => {
                        expect(result).to.exist;
                        expect(result.code).to.exist.and.to.equal(200);
                        let profile = result.profile;
                        expect(profile).to.exist;
                        expect(profile._id).to.exist.and.to.equal(userId);
                    });
                // return DbManager.getProfilesCollection().vertex("Profile/" + userId)
            });

    });
    it("already existing email with initialized account");
    it("without phone number");
    it("without hero name");
    it("with invalid phone number");
    it("with phone number with characters");
    it("with long hero name");
});