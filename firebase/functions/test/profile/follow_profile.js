const expect = require('chai').expect;

const followProfile = require('../../modules/profile/follow_user');
const Profile = require('../../modules/models/profile');
const DbManager = require('../../modules/db/db_manager');

describe('follow profile', () => {
    it('should follow user', () => {
        return followProfile("one@test.com", "two@test.com")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            });
    });
    it('should not follow current user', () => {
        return followProfile("one@test.com", "one@test.com")
            .catch(error => {
                expect(error).to.exist.and.to.equal("cannot-follow-himself");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it.skip('should fail when following banned user', () => {
        let profileId1;
        let profileId2;
        return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
            .then(cursor => {
                return cursor.next();
            })
            .then(profile => {
                profileId1 = profile._id;
                return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "two@test.com"})
                    .then(cursor => {
                        return cursor.next();
                    });
            })
            .then((profile) => {
                profile.banned = true;
                return profile.save();
            })
            .then(profile => {
                profileId2 = profile._id;
                return followProfile(profileId1, profileId2)
                    .catch(error => {
                        expect(error).to.exist.to.equal(Errors.userBanned);
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it.skip('should fail when following new user', () => {
        return followProfile("one@test.com", "new@test.com")
            .catch(error => {
                expect(error).to.exist.to.equal("profile-not-active");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it.skip('should fail when following non existing user', () => {
        return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "one@test.com"})
            .then(cursor => {
                return cursor.next();
            })
            .then(profile => {
                return followProfile(profile._id, "6b066d0b2540d9641c1665f1")
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("profile-not-found");
                    });
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail when following already followed profile', () => {


        return followProfile("one@test.com", "two@test.com")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            })
            .then(() => {
                return followProfile("one@test.com", "two@test.com")
                    .catch(error => {
                        expect(error).to.exist.and.to.equal("already-followed");
                    })
                    .then(result => {
                        expect(result).to.not.exist;
                    });
            });
    });
});