const expect = require('chai').expect;
const Profile = require("../../modules/models/profile");
const getThreadForUser = require('../../modules/threads/get_thread_for_user');
const getMyThreads = require('../../modules/threads/get_my_threads');
const DbManager = require('../../modules/db/db_manager');

describe('getting my threads', () => {
    beforeEach(() => {

    });
    it('should return my threads', () => {
        return getThreadForUser("one@test.com", "two@test.com")
            .then(() => {
                return getThreadForUser("one@test.com", "three@test.com");
            })
            .then(() => {
                return getThreadForUser("two@test.com", "three@test.com");
            })
            .then(() => {
                return getMyThreads("one@test.com")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results).to.exist;
                expect(result.results.threads).to.exist.and.to.have.length(2);

                return getMyThreads("two@test.com")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.threads).to.exist.and.to.have.length(2);
                return getMyThreads("three@test.com")
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.threads).to.exist.and.to.have.length(2);
            });
    });
    it('should return empty list if no threads found', () => {
        return getMyThreads("one@test.com")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.threads).to.exist.and.to.have.length(0);
            });
    });
    it("should ignore if user has deleted thread");
});