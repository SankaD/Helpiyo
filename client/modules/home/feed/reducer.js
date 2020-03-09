import * as types from './types';
import * as requestActionTypes from '../../requests/types';
import * as responseActionTypes from '../../responses/types';
import * as ratingActionTypes from '../../ratings/types';
import * as serviceActionTypes from '../../services/types';

const initialState = {
  feed: [],
  shouldReloadFeed: false,
  refreshing: false,
  lastLocation: null,
};

export default (state = initialState, action) => {
  if (action.type === types.LOAD_FEED) {
    return Object.assign({}, state, {
      refreshing: true,
      shouldReloadFeed: false,
      lastLocation: { latitude: action.latitude, longitude: action.longitude },
    });
  } else if (action.type === types.FEED_LOAD_FAILED) {
    return Object.assign({}, state, { refreshing: false, miscError: action.error });
  } else if (action.type === types.FEED_LOADED) {
    return Object.assign({}, state, { refreshing: false, feed: action.feed });
  } else if (action.type === requestActionTypes.REQUEST_CREATED
        || action.type === requestActionTypes.REQUEST_EDITED
        || action.type === responseActionTypes.RESPONSE_CREATED
        || action.type === requestActionTypes.REQUEST_DELETED
  ) {
    return Object.assign({}, state, { shouldReloadFeed: true });
  } else if (action.type === types.RELOAD_FEED) {
    return Object.assign({}, state, { shouldReloadFeed: true });
  } else if (action.type === ratingActionTypes.REQUEST_COMPLETED) {
    return Object.assign({}, state, { shouldReloadFeed: true });
  } else if (action.type === requestActionTypes.REQUEST_PROMOTED
        || action.type === serviceActionTypes.SERVICE_PROMOTED) {
    return Object.assign({}, state, { shouldReloadFeed: true });
  }

  return Object.assign({}, state);
};
