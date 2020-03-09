const expect = require('chai').expect;

const registerToken = require('../../modules/profile/register_device_token');
const DbManager = require('../../modules/db/db_manager');

describe('registering device token', () => {
    let profileId1;
    let profileId2;
    let newProfileId;
    beforeEach(() => {
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
            .then(profile => {
                profileId2 = profile._id;
                return DbManager.db.query("FOR profile IN Profile FILTER profile.email==@email return profile", {email: "new@test.com"})
                    .then(cursor => {
                        return cursor.next();
                    });
            })
            .then(profile => {
                newProfileId = profile._id;
            });
    });

    it('should pass when registering new device', () => {
        return registerToken(profileId1, "test-token", "device-id")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            });
    });
    it('should pass when registering new token', () => {
        return registerToken(profileId1, "test-token", "device-id")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                return registerToken(profileId1, "test-token-2", "device-id")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            });
    });
    it('should pass when registering existing token', () => {
        return registerToken(profileId1, "test-token", "device-id")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                return registerToken(profileId2, "test-token", "device-id-2")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
            });
    });
    it('should fail if userId empty', () => {
        return registerToken("", "test-token", "device-id")
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if token empty', () => {
        return registerToken(profileId1, "", "device-id")
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if deviceId empty', () => {
        return registerToken(profileId1, "test-token", "")
            .catch(error => {
                expect(error).to.exist.and.to.equal("validation-failure");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
});