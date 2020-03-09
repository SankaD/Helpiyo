const expect = require('chai').expect;
const followProfile = require('../../modules/profile/follow_user');
const unfollowProfile = require('../../modules/profile/unfollow_user');
const isFollowing = require('../../modules/profile/is_following');
const Profile = require('../../modules/models/profile');

describe('is following profile', () => {
    it('should be following after followed', () => {
        return followProfile("one@test.com", "two@test.com")
            .then(() => {
                return isFollowing("one@test.com", "two@test.com")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.following).to.exist.and.to.be.true;
            });
    });
    it('should not be following after unfollowed', () => {
        return followProfile("one@test.com", "two@test.com")
            .then(() => {
                return unfollowProfile("one@test.com", "two@test.com");
            })
            .then(() => {
                return isFollowing("one@test.com", "two@test.com")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.following).to.exist.and.to.be.false;
            });
    });
    it('should not be following if not followed', () => {
        return isFollowing("one@test.com", "two@test.com")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.following).to.exist.and.to.be.false;
            });
    });
    it('should not be following if profile not exists', () => {
        return isFollowing("one@test.com", "6b075bb95712948c7c550fe9")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.following).to.exist.and.to.be.false;
            });
    });
});