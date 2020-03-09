const expect = require('chai').expect;

const Profile = require('../../modules/models/profile');
// const Badge = require('../../modules/models/badge');

const getBadges = require('../../modules/profile/get_badges');


describe.skip('getting badges', () => {
    it('should fail if profile is not found', () => {
        return getBadges("6b027f1f6271c25db243c14e")
            .catch(error => {
                expect(error).to.exist.and.to.equal(Errors.profileNotFound);
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if profile is banned', () => {
        return Profile.findOne({
            email: "one@test.com"
        }).exec()
            .then(profile => {
                profile.banned = true;
                return profile.save();
            })
            .then(profile => {
                return getBadges(profile._id)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal(Errors.profileNotFound);
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if profile is deactivated', () => {
        return Profile.findOne({
            email: "one@test.com"
        }).exec()
            .then(profile => {
                profile.deactivated = true;
                return profile.save();
            })
            .then(profile => {
                return getBadges(profile._id)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal(Errors.profileNotFound);
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if profile is new', () => {
        return Profile.findOne({
            email: "one@test.com"
        }).exec()
            .then(profile => {
                profile.status = "new";
                return profile.save();
            })
            .then(profile => {
                return getBadges(profile._id)
                    .catch(error => {
                        expect(error).to.exist.and.to.equal(Errors.profileNotActive);
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it.skip('should return badge if exists', () => {
        return Profile.findOne({
            email: "one@test.com"
        }).exec()
            .then(profile => {
                return getBadges(profile._id)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result.code).to.not.exist.and.to.equal(200);
                expect(result.badges).to.exist.and.to.have.length(1);
                let badge = result.badges[0];
                expect(badge).to.exist;
                expect(badge.badge).to.exist;
                expect(badge.createdOn).to.exist;
            });
    });
});