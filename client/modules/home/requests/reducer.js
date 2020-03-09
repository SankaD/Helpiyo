import * as types from './types';
import * as requestActionTypes from '../../requests/types';
import * as ratingsActionTypes from '../../ratings/types';

const initialState = {
  myRequests: [],
  reloadRequests: false,
  refreshing: false,
  ratingModalVisible: false,
  currentRequestId: null,
  commentError: '',
  ratingError: '',
  miscError: '',
};

export default (state = initialState, action) => {
  if (action.type === types.LOAD_REQUEST_FAILED) {
    return Object.assign({}, state, {
      miscError: action.error,
      refreshing: false,
    });
  } else if (action.type === types.LOAD_REQUESTS) {
    return Object.assign({}, state, {
      reloadRequests: false,
      refreshing: true,
    });
  } else if (action.type === types.REQUESTS_LOADED) {
    return Object.assign({}, state, {
      myRequests: action.requests,
      refreshing: false,
    });
  } else if (action.type === requestActionTypes.REQUEST_CREATED
      || action.type === requestActionTypes.REQUEST_DELETED) {
    return Object.assign({}, state, {
      reloadRequests: true,
    });
  } else if (action.type === types.SHOW_RATING_MODAL) {
    return Object.assign({}, state, {
      ratingModalVisible: true,
      currentRequestId: action.requestId,
    });
  } else if (action.type === types.HIDE_RATING_MODAL) {
    return Object.assign({}, state, {
      ratingModalVisible: false,
      currentRequestId: null,
    });
  } else if (action.type === requestActionTypes.REQUEST_EDITED) {
    return Object.assign({}, state, {
      reloadRequests: true,
    });
  } else if (action.type === ratingsActionTypes.REQUEST_COMPLETED) {
    return Object.assign({}, state, {
      reloadRequests: true,
    });
  }

  return Object.assign({}, state);
};

