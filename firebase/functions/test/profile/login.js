const expect = require('chai').expect;

// const login = require('../../modules/profile/login');
const Profile = require('../../modules/models/profile');

describe.skip('user login', () => {
    let currentUser;

    beforeEach(() => {
        return Profile.findOne({email: "one@test.com"}).exec()
            .then(profile => {
                currentUser = profile;
            });
    });
    it('should login use with correct username and password', () => {
        return login("one@test.com", "Password@123")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(data => {
                expect(data).to.exist;
                expect(data.code).to.exist.and.to.equal(200);
                expect(data.profileId).to.exist.and.to.equal(currentUser._id);
                expect(data.token).to.exist;
            });
    });
    it('should not login with incorrect username', () => {
        return login("two2@test.com", "Password@123")
            .catch(error => {
                expect(error).to.exist;
                expect(error.code).to.equal(Errors.usernamePasswordMismatch.code);
                expect(error.message).to.equal(Errors.usernamePasswordMismatch.message);
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should not login with invalid password', () => {
        return login("one@test.com", "Password@1234")
            .catch(error => {
                expect(error).to.exist;
                expect(error.code).to.equal(Errors.usernamePasswordMismatch.code);
                expect(error.message).to.equal(Errors.usernamePasswordMismatch.message);
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should not login with empty username', () => {
        return login("", "Password@123")
            .catch(error => {
                expect(error).to.exist;
                expect(error.code).to.equal(Errors.usernamePasswordMismatch.code);
                expect(error.message).to.equal(Errors.usernamePasswordMismatch.message);
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should not login with empty password', () => {
        return login("two2@test.com", "")
            .catch(error => {
                expect(error).to.exist;
                expect(error.code).to.equal(Errors.usernamePasswordMismatch.code);
                expect(error.message).to.equal(Errors.usernamePasswordMismatch.message);
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should not login with banned user', () => {
        currentUser.banned = true;
        return currentUser.save()
            .then(() => {
                return login("one@test.com", "Password@123")
                    .catch(error => {
                        expect(error).to.exist;
                        expect(error.code).to.exist.and.to.equal(Errors.usernamePasswordMismatch.code);
                        expect(error.message).to.exist.and.to.equal(Errors.usernamePasswordMismatch.message);
                    })
                    .then(result => {
                        expect(result).to.not.exist;
                    });
            });
    });

});