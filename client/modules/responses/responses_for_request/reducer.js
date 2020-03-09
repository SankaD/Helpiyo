import * as types from '../types';
import * as ratingTypes from '../../ratings/types';

const initialState = {
  reload: false,
  refreshing: false,
  responses: [],
  requestId: null,
  errors: [],
  ratingError: '',
  commentError: '',
  miscError: '',
};

export default (state = initialState, action) => {
  if (action.type === types.LOAD_RESPONSES_FOR_REQUEST) {
    return Object.assign({}, state, {
      requestId: action.requestId,
      refreshing: true,
      reload: false,
      responses: [],
      errors: [],
    });
  } else if (action.type === types.LOAD_RESPONSES_FOR_REQUEST_FAILED) {
    return Object.assign({}, state, {
      errors: action.error,
      refreshing: false,
    });
  } else if (action.type === types.RESPONSES_FOR_REQUEST_LOADED) {
    return Object.assign({}, state, {
      refreshing: false,
      responses: action.responses,
      reload: false,
    });
  } else if (action.type === ratingTypes.RESPONSE_REJECTED) {
    return Object.assign({}, state, {
      reload: true,
      ratingError: '',
      commentError: '',
      miscError: '',
    });
  } else if (action.type === ratingTypes.REJECT_RESPONSE_FAILED) {
    return Object.assign({}, state, {
      reload: true,
      ratingError: '',
      commentError: '',
      miscError: '',
    });
  } else if (action.type === ratingTypes.REJECT_RESPONSE) {
    return Object.assign({}, state, {
      ratingError: action.ratingError || '',
      commentError: action.commentError || '',
      miscError: action.miscError || '',
    });
  } else if (action.type === types.ACCEPT_RESPONSE) {
    return Object.assign({}, state, {
    });
  } else if (action.type === types.RESPONSE_ACCEPTED) {
    return Object.assign({}, state, {
      reload: true,
    });
  } else if (action.type === types.ACCEPTING_RESPONSE_FAILED) {
    return Object.assign({}, state, {
      reload: true,
    });
  } else if (action.type === types.ACCEPTING_RESPONSE) {
    return Object.assign({}, state, {
      refreshing: true,
    });
  } else if (action.type === ratingTypes.COMPLETE_RESPONSE) {
    return Object.assign({}, state, {
      ratingError: '',
      commentError: '',
      miscError: '',
    });
  } else if (action.type === ratingTypes.RESPONSE_COMPLETED) {
    return Object.assign({}, state, {
      reloadResponses: true,
      ratingError: '',
      commentError: '',
      miscError: '',
    });
  } else if (action.type === ratingTypes.COMPLETE_RESPONSE_FAILED) {
    return Object.assign({}, state, {
      ratingError: action.ratingError || '',
      commentError: action.commentError || '',
      miscError: action.miscError || '',
    });
  } else if (action.type === ratingTypes.COMPLETING_RESPONSE) {
    return Object.assign({}, state, {
      ratingError: action.ratingError || '',
      commentError: action.commentError || '',
      miscError: action.miscError || '',
    });
  }
  return state;
};
