const expect = require('chai').expect;
const MessageThread = require('../../modules/models/message_thread');

const createMessage = require('../../modules/messages/create_message');
const getThreadForUser = require('../../modules/threads/get_thread_for_user');
const getMessagesInThread = require('../../modules/messages/get_messages_in_thread');

describe('getting messages in thread', () => {
    let thread;
    beforeEach(() => {
        return getThreadForUser("one@test.com", "two@test.com")
            .then(result => {
                thread = result.results.thread._id;
                expect(thread).to.exist.and.to.be.string;
            });
    });
    it('should return messages in the thread', () => {
        return createMessage("one@test.com", thread, "testing 123")
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.messageResult).to.exist;

                return getMessagesInThread("one@test.com", thread)
                    .catch(error => {
                        expect(error).to.not.exist;
                    });
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.messages).to.exist.and.to.have.length(1);
                expect(result.results.profiles).to.exist.and.to.have.key("one@test.com");
                let message = result.results.messages[0];
                expect(message).to.exist;
                expect(message._id).to.exist.and.to.be.string;
                expect(message.modifiedOn).to.exist;

                let profile = result.results.profiles["one@test.com"];
                expect(profile).to.exist;
                expect(profile._id).to.exist.and.to.equal("one@test.com");
            });
    });
    it('should return empty list if no messages in the thread', () => {
        return getMessagesInThread("one@test.com", thread)
            .catch(error => {
                expect(error).to.not.exist;
            })
            .then(result => {
                expect(result).to.exist;
                expect(result.code).to.exist.and.to.equal(200);
                expect(result.results.messages).to.exist.and.to.have.length(0);
            });
    });
    it('should fail if thread not found', () => {
        return getMessagesInThread("one@test.com", "6b2326c4dfc37f32f0935695")
            .catch(error => {
                expect(error).to.exist.and.to.equal("active-thread-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
    it('should fail if not a participant in the thread', () => {
        return getMessagesInThread("three@test.com", thread)
            .catch(error => {
                expect(error).to.exist.and.to.equal("active-thread-not-found");
            })
            .then(result => {
                expect(result).to.not.exist;
            });
    });
});