import * as types from './types';

const initialState = {
  notifications: [],
  refreshing: false,
};

export default (state = initialState, action) => {
  if (action.type === types.NOTIFICATIONS_LOADED) {
    return Object.assign({}, state, { notifications: action.notifications, refreshing: false });
  } else if (action.type === types.LOAD_NOTIFICATIONS) {
    return Object.assign({}, state, { refreshing: true });
  } else if (action.type === types.LOAD_NOTIFICATIONS_FAILED) {
    return Object.assign({}, state, { refreshing: false });
  }
  return state;
};
