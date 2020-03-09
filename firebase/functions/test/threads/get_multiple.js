const expect = require('chai').expect;
const Thread = require('../../modules/models/message_thread');
const Profile = require("../../modules/models/profile");
const getMultiple = require('../../modules/threads/get_multiple');
const getThreadForUser = require('../../modules/threads/get_thread_for_user');

describe('get multiple threads', () => {
    beforeEach(() => {
    });
    it('should return threads if exists', () => {
        let thread1;
        let thread2;
        return getThreadForUser("one@test.com", "two@test.com")
            .then(result => {
                thread1 = result.results.thread._id;
                return getThreadForUser("one@test.com", "three@test.com");
            })
            .then(result => {
                thread2 = result.results.thread._id;
                return getMultiple("one@test.com", [thread1, thread2])
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.threads).to.exist.and.to.have.length(2);
                let thread = result.results.threads[0];
                expect(thread).to.exist;
                expect(thread._id).to.exist.and.to.be.string;
                // expect(thread.participants).to.exist.and.to.have.length(2);
                expect(thread.requestId).to.not.exist;
                expect(thread.name).to.not.exist;
                expect(thread.modifiedOn).to.exist;
                expect(thread.createdOn).to.exist;
            });
    });
    it('should ignore non existing threads', () => {
        let thread1;
        let thread2;
        return getThreadForUser("one@test.com", "two@test.com")
            .then(result => {
                thread1 = result.results.thread._id;
                return getThreadForUser("one@test.com", "three@test.com");
            })
            .then(result => {
                thread2 = result.results.thread._id;
                return getMultiple("one@test.com", [thread1, thread2, "6b2326c4dfc37f32f0935695"])
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
    it('should return empty if ids are empty', () => {
        return getMultiple("one@test.com", [])
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.threads).to.exist.and.to.have.length(0);
            });
    });
});