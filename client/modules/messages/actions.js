import { NavigationActions } from 'react-navigation';
import Toast from '../utils/toast';
import * as types from './types';
import fillCreators from '../utils/fill_creators';
import MessageHandler from '../common/data_handlers/message_handler';
import ProfileHandler from '../common/data_handlers/profile_handler';
import Logger from '../utils/logger';

export function openThread(threadId) {
  Logger.info('opening thread');
  return (dispatch) => {
    dispatch({ type: types.OPEN_THREAD, threadId });
    dispatch(NavigationActions.navigate({ routeName: 'MessageView', key: 'MessageView' }));
  };
}

export function createMessage(threadId, message, addedMessage) {
  Logger.info('creating message');
  return (dispatch) => {
    dispatch({ type: types.CREATE_MESSAGE, addedMessage });
    MessageHandler.createMessage(threadId, message)
      .then((result) => {
        Logger.info('message created');
        dispatch({ type: types.MESSAGE_CREATED });
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error('Message not sent');
        dispatch({ type: types.CREATE_MESSAGE_FAILED, error });
      });
  };
}

export function getThreads() {
  Logger.info('getting threads');
  return (dispatch) => {
    dispatch({ type: types.LOAD_THREADS });
    MessageHandler.getMyThreads()
      .then((threads) => {
        dispatch({ type: types.THREADS_LOADED, threads });
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error("Couldn't load message thread info");
        dispatch({ type: types.LOAD_THREAD_FAILED, errors: error });
      });
  };
}
export function openThreadForUser(userId) {
  Logger.info('opening thread for user');
  return (dispatch) => {
    MessageHandler.getThreadForUser(userId)
      .then((thread) => {
        Logger.info('thread received');
        dispatch(openThread(thread._id));
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error("Couldn't load message thread for user");
      });
  };
}

export function openThreadForRequest(requestId) {
  Logger.info('opening thread for request');
  return (dispatch) => {
    MessageHandler.getThreadForRequest(requestId)
      .then((thread) => {
        Logger.info('thread received');
        dispatch(openThread(thread._id));
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error("Couldn't load message thread for request");
      });
  };
}

export function getMessagesForThread(threadId) {
  Logger.info(`getting messages for thread : ${threadId}`);
  Logger.info(threadId);
  return (dispatch) => {
    dispatch({ type: types.LOAD_MESSAGES });
    MessageHandler.getMessages(threadId)
      // .then(messages => fillCreators(messages))
      .then((messages) => {
        messages.sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime());
        return messages;
      })
      .then((messages) => {
        Logger.info('messages received');
        dispatch({ type: types.MESSAGES_LOADED, messages });
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error("Couldn't load messages for thread");
        dispatch({ type: types.LOAD_MESSAGES_FAILED, error });
      });
  };
}
