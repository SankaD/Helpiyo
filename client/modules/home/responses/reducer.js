import * as types from './types';
import * as responseActionTypes from '../../responses/types';
import * as ratingsActionTypes from '../../ratings/types';

const initialState = {
  myResponses: [],
  reloadResponses: false,
  refreshing: false,
  ratingModalVisible: false,
  currentResponseId: null,
  commentError: '',
  ratingError: '',
  miscError: '',
};

export default (state = initialState, action) => {
  if (action.type === types.LOAD_RESPONSES) {
    return Object.assign({}, state, {
      reloadResponses: false,
      refreshing: true,
    });
  } else if (action.type === types.LOAD_RESPONSES_FAILED) {
    return Object.assign({}, state, { miscError: action.error, refreshing: false });
  } else if (action.type === types.RESPONSES_LOADED) {
    return Object.assign({}, state, {
      myResponses: action.responses,
      refreshing: false,
    });
  } else if (action.type === responseActionTypes.RESPONSE_CREATED) {
    return Object.assign({}, state, { reloadResponses: true });
  } else if (action.type === responseActionTypes.RESPONSE_EDITED) {
    return Object.assign({}, state, { reloadResponses: true });
  } else if (action.type === types.SHOW_RATING_MODAL) {
    return Object.assign({}, state, {
      ratingModalVisible: true,
      currentResponseId: action.responseId,
    });
  } else if (action.type === types.HIDE_RATING_MODAL) {
    return Object.assign({}, state, {
      ratingModalVisible: false,
      currentResponseId: null,
    });
  } else if (action.type === responseActionTypes.RESPONSE_DELETED) {
    return Object.assign({}, state, {
      reloadResponses: true,
    });
  } else if (action.type === ratingsActionTypes.RESPONSE_REJECTED) {
    return Object.assign({}, state, {
      reloadResponses: true,
    });
  } else if (action.type === ratingsActionTypes.RESPONSE_COMPLETED) {
    return Object.assign({}, state, {
      reloadResponses: true,
    });
  }
  return Object.assign({}, state);
};
