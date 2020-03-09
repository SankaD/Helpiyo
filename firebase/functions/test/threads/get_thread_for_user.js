const expect = require('chai').expect;

const getThreadForUser = require('../../modules/threads/get_thread_for_user');

describe('getting thread for user', () => {
    beforeEach(() => {

    });
    it('should return thread for a given user', () => {
        let threadId;
        return getThreadForUser("one@test.com", "two@test.com")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.thread._id).to.exist;
                threadId = result.results.thread._id;
                return getThreadForUser("one@test.com", "two@test.com")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.thread._id).to.exist.and.to.equal(threadId);
            });
    });
    it.skip('should fail for non existing user', () => {
        return getThreadForUser("one@test.com", "6b2326c4dfc37f32f0935695")
            .catch(error => {
                expect(error).to.exist.and.to.equal("profile-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should return same thread if requested by other user', () => {
        let threadId;
        return getThreadForUser("one@test.com", "two@test.com")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.thread._id).to.exist;
                threadId = result.results.thread._id;
                return getThreadForUser("two@test.com", "one@test.com")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.thread._id).to.exist.and.to.equal(threadId);
            });
    });
});