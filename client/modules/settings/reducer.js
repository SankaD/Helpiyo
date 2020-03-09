import * as types from './types';

const initialState = {
  settings: {},
  currentSettingPath: '',
  feedbackSubmitted: false,
  feedback: '',
  feedbackError: '',
  feedbackModalVisible: false,
  refreshing: false,
  tobeRefreshed: false,
  interests: [],
};

export default (state = initialState, action) => {
  if (action.type === types.SUBMIT_FEEDBACK) {
    return Object.assign({}, state, {
      feedbackError: '',
      feedback: '',
    });
  } else if (action.type === types.SUBMIT_FEEDBACK_FAILED) {
    return Object.assign({}, state, {
      feedbackError: action.feedbackError,
    });
  } else if (action.type === types.FEEDBACK_SUBMITTED) {
    return Object.assign({}, state, {
      feedbackModalVisible: false,
    });
  } else if (action.type === types.SHOW_FEEDBACK_MODAL) {
    return Object.assign({}, state, {
      feedbackModalVisible: action.visible,
      passwordModalVisible: false,
      phoneModalVisible: false,
    });
  } else if (action.type === types.LOAD_INTERESTS) {
    return Object.assign({}, state, {
      refreshing: true,
      tobeRefreshed: false,
    });
  } else if (action.type === types.INTERESTS_LOADED) {
    return Object.assign({}, state, {
      refreshing: false,
      interests: action.interests,
    });
  } else if (action.type === types.LOAD_INTERESTS_FAILED) {
    return Object.assign({}, state, {
      refreshing: false,
    });
  } else if (action.type === types.SET_INTERESTS) {
    return Object.assign({}, state, {
      refreshing: true,
    });
  } else if (action.type === types.SET_INTERESTS_FAILED) {
    return Object.assign({}, state, {
      refreshing: false,
    });
  } else if (action.type === types.INTERESTS_SET) {
    return Object.assign({}, state, {
      refreshing: false,
      tobeRefreshed: true,
    });
  }
  return state;
};
