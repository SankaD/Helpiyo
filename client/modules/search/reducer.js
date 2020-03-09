import * as types from './types';

const initialState = {
  results: {
    profiles: [],
    requests: [],
    services: [],
  },
  refreshing: false,
  filter: 'request',
};

export default (state = initialState, action) => {
  if (action.type === types.SEARCH) {
    return Object.assign({}, state, {
      // results: initialState.results,
      refreshing: true,
    });
  }
  if (action.type === types.SEACH_RESULTS_RECEIVED) {
    return Object.assign({}, state, {
      results: action.results,
      refreshing: false,
    });
  }
  if (action.type === types.SEARCH_FAILED) {
    return Object.assign({}, state, {
      results: initialState.results,
      refreshing: false,
    });
  }
  if (action.type === types.FILTER_CHANGED) {
    return Object.assign({}, state, {
      filter: action.filter,
    });
  }
  return Object.assign({}, state);
};
