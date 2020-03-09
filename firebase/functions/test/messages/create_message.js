const expect = require('chai').expect;
const getThreadForUser = require('../../modules/threads/get_thread_for_user');
const createMessage = require('../../modules/messages/create_message');

describe('creating message', () => {
    let thread;
    beforeEach(() => {
        return getThreadForUser("one@test.com", "two@test.com")
            .then(result => {
                thread = result.results.thread._id;
            });
    });
    it('should create message when created', () => {
        return createMessage("one@test.com", thread, "testing 123")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.messageResult).to.exist;
            });
    });
    it('should fail if not in the thread', () => {
        return createMessage("three@test.com", thread, "testing 234")
            .catch(error => {
                expect(error).to.exist.and.to.equal("active-thread-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if no content', () => {
        return createMessage("one@test.com", thread, "")
            .catch(error => {
                expect(error).to.exist;
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it.skip('should fail if not a valid thread', () => {
        return createMessage("one@test.com", "6b2326c4dfc37f32f0935695", "testing 123")
            .catch(error => {
                expect(error).to.exist.and.to.equal("thread-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if thread deleted by user');
    it('should create message in group thread');
});