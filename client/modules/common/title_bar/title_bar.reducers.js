import * as types from './title_bar.actiontypes';

const initialState = {
  searchResults: {
    profiles: [],
    requests: [],
  },
  searchInProgress: false,
  lastSearchedOn: Date.now(),
  searchString: '',
  unreadMessageNotificationCount: 0,
  unreadNotificationCount: 0,
};

export default function (state = initialState, action) {
  if (action.type === types.SEARCH_RESULTS_RECEIVED) {
    return Object.assign({}, state, {
      searchResults: action.results,
      searchInProgress: true,
    });
  } else
  if (action.type === types.SEARCH) {
    return Object.assign({}, state, {
      searchResults: initialState.searchResults,
      searchInProgress: false,
      lastSearchedOn: Date.now(),
      searchString: action.searchString,
    });
  } else if (action.type === types.SEARCH_FAILED) {
    return Object.assign({}, state, {
      searchResults: initialState.searchResults,
      searchInProgress: false,
    });
  } else if (action.type === types.DISCARD_SEARCH_RESULTS) {
    return Object.assign({}, state, {
      searchResults: initialState.searchResults,
      searchInProgress: false,
      searchString: '',
    });
  } else if (action.type === types.MESSAGE_RECEIVED) {
    return Object.assign({}, state, {
      unreadMessageNotificationCount: state.unreadMessageNotificationCount + 1,
    });
  } else if (action.type === types.NOTIFICATION_RECEIVED) {
    return Object.assign({}, state, {
      unreadNotificationCount: state.unreadNotificationCount + 1,
    });
  } else if (action.type === types.OPEN_MESSAGES) {
    return Object.assign({}, state, {
      unreadMessageNotificationCount: 0,
    });
  } else if (action.type === types.OPEN_NOTIFICATIONS) {
    return Object.assign({}, state, {
      unreadNotificationCount: 0,
    });
  } else if (action.type === types.NOTIFICATION_COUNT_RECEIVED) {
    return Object.assign({}, state, {
      unreadNotificationCount: action.count,
    });
  } else if (action.type === types.MESSAGE_COUNT_RECEIVED) {
    return Object.assign({}, state, {
      unreadMessageNotificationCount: action.count,
    });
  }

  return state;
}
