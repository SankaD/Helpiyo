import { networkGet, networkPost } from '../../utils/url_helper';
import NetworkHandler from './network_handler';
import Logger from '../../utils/logger';

const MessageHandler = {
  getThreadForUser(userId) {
    Logger.info('getting thread for user');
    return networkGet(`threads/get-thread-for-user/${encodeURIComponent(userId)}`)
      .then((results) => {
        Logger.info('thread id received for user');
        const { thread, profiles } = results.results;
        thread.participants = thread.participants.map(part => profiles[part]);
        return thread;
      })
      .catch((error) => {
        Logger.info("couldn't get thread for user");
        Logger.error(error);
        throw error;
      });
  },
  getThreadForRequest(requestId) {
    Logger.info('getting thread for request');
    return networkGet(`threads/get-thread-for-request/${encodeURIComponent(requestId)}`)
      .then((result) => {
        Logger.info('thread id received for request');
        // const networkHandler = new NetworkHandler('threads');
        // return networkHandler.getItems([result.threadId]);
      })
      .then(threads => threads[0])
      .catch((error) => {
        Logger.info("couldn't get thread for request");
        Logger.error(error);
        throw error;
      });
  },
  getMyThreads() {
    Logger.info('getting my threads');
    return networkGet('threads/get-my-threads')
      .then((results) => {
        Logger.info('my threads received');
        const { threads, profiles } = results.results;

        threads.forEach((thread) => {
          thread.participants = thread.participants.map(part => profiles[part]);
          thread.creator = profiles[thread.createdBy];
        });
        return threads;
      })
      .catch((error) => {
        Logger.info("couldn't get my threads");
        Logger.error(error);
        throw error;
      });
  },
  createMessage(threadId, message) {
    Logger.info('creating message');
    return networkPost('messages/create-message', JSON.stringify({ threadId, content: message }))
      .then((result) => {
        Logger.info('message created');
        if (result.code !== 200) {
          throw 'message-not-created';
        }
        return result.messageResult;
      })
      .catch((error) => {
        Logger.error(error);
        throw error;
      });
  },
  getMessages(threadId) {
    Logger.info(`getting messages for thread : ${threadId}`);
    return networkGet(`messages/get-messages-in-thread/${encodeURIComponent(threadId)}`)
      .then((result) => {
        Logger.info('messages received');
        Logger.info(result);
        const { messages, profiles } = result.results;
        messages.forEach((message) => {
          message.creator = profiles[message.createdBy];
          message.text = message.message;
        });
        return messages;
      })
      .catch((error) => {
        Logger.error(error);
        throw error;
      });
  },
};

export default MessageHandler;
