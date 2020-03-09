import * as types from './types';
import * as notifTypes from '../../common/title_bar/title_bar.actiontypes';

const initialState = {
  requests: [],
  shouldReloadData: false,
};

export default (state = initialState, action) => {
  if (action.type === types.GET_NEARBY_REQUESTS) {
    return Object.assign({}, state, {
      shouldReloadData: false,
    });
  } else if (action.type === types.GET_NEARBY_REQUESTS_FAILED) {
    return Object.assign({}, state, {
      miscError: action.miscError,
      shouldReloadData: false,
    });
  } else if (action.type === types.NEARBY_REQUESTS_RECEIVED) {
    return Object.assign({}, state, {
      requests: action.requests,
      shouldReloadData: false,
    });
  } else if (action.type === notifTypes.SOS_NOTIFICATION_RECEIVED) {
    return Object.assign({}, state, {
      shouldReloadData: true,
    });
  }
  return Object.assign({}, state);
};

