import * as types from './types';
import * as titleBarTypes from '../common/title_bar/title_bar.actiontypes';

const initialState = {
  threads: [],
  messages: [],
  refreshingThreads: false,
  refreshingMessages: false,
  threadId: null,
  reloadMessages: false,
};

export default (state = initialState, action) => {
  if (action.type === types.LOAD_THREADS) {
    return Object.assign({}, state, {
      miscError: null,
      refreshingThreads: true,
    });
  } else if (action.type === types.THREADS_LOADED) {
    return Object.assign({}, state, {
      miscError: null,
      threads: action.threads,
      refreshingThreads: false,
    });
  } else if (action.type === types.LOAD_THREAD_FAILED) {
    return Object.assign({}, state, {
      miscError: action.error,
      refreshingThreads: false,
    });
  } else if (action.type === types.OPEN_THREAD) {
    return Object.assign({}, state, {
      threadId: action.threadId,
    });
  } else if (action.type === types.LOAD_MESSAGES) {
    return Object.assign({}, state, {
      error: null,
      refreshingMessages: true,
    });
  } else if (action.type === types.LOAD_MESSAGES_FAILED) {
    return Object.assign({}, state, {
      error: action.error,
      reloadMessages: false,
      refreshingMessages: false,
    });
  } else if (action.type === types.MESSAGES_LOADED) {
    return Object.assign({}, state, {
      messages: action.messages,
      reloadMessages: false,
      refreshingMessages: false,
    });
  } else if (action.type === types.MESSAGE_CREATED) {
    return Object.assign({}, state, {
      reloadMessages: true,
    });
  } else if (action.type === titleBarTypes.MESSAGE_RECEIVED) {
    if (state.threadId === action.threadId) {
      return Object.assign({}, state, {
        reloadMessages: true,
      });
    }
  } else if (action.type === types.CREATE_MESSAGE) {
    const newMessages = state.messages.slice(0);
    newMessages.push(action.addedMessage);
    return Object.assign({}, state, {
      messages: newMessages,
    });
  }
  return state;
};
