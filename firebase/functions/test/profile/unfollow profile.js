const expect = require('chai').expect;

const followProfile = require('../../modules/profile/follow_user');
const unfollowProfile = require('../../modules/profile/unfollow_user');
const Profile = require('../../modules/models/profile');
const DbManager = require('../../modules/db/db_manager');

describe('unfollowing user', () => {
    it('should unfollow followed user', () => {
        return followProfile("one@test.com", "two@test.com")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then((result) => {
                expect(result).to.exist;
                return unfollowProfile("one@test.com", "two@test.com");
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            });
    });
    it('should fail if user is not followed', () => {
        return unfollowProfile("one@test.com", "two@test.com")
            .then(result => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist;
                expect(error).to.equal("user-not-following");
            });
    });
    it.skip('should fail if user is banned', () => {
        return followProfile("one@test.com", "two@test.com")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                return Profile.findById("two@test.com").exec();
            })
            .then(profile => {
                profile.banned = true;
                return profile.save();
            })
            .then((result) => {
                return unfollowProfile("one@test.com", "two@test.com")
                    .catch(error => {
                        expect(error).to.exist.and.to.equal(Errors.userBanned);
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });

    it.skip('should fail if user is not existing', () => {
        return unfollowProfile("one@test.com", "6b06d6f463af3b83bc51e3b7")
            .then(result => {
                expect(result).to.not.exist;
            })
            .catch(error => {
                expect(error).to.exist.and.to.equal("profile-not-found");
            });
    });
});