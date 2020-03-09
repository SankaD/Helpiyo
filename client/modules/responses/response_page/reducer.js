import * as types from '../types';

const initialState = {
  currentResponse: null,
  responseId: '',
};

export default (state = initialState, action) => {
  if (action.type === types.SHOW_RESPONSE) {
    return Object.assign({}, state, {
      currentResponse: null,
      responseId: action.responseId,
    });
  } else if (action.type === types.LOAD_RESPONSE) {
    return Object.assign({}, state, {
      currentResponse: null,
    });
  } else if (action.type === types.RESPONSE_LOADED) {
    return Object.assign({}, state, {
      currentResponse: action.response,
    });
  } else if (action.type === types.LOAD_RESPONSE_FAILED) {
    return Object.assign({}, state, {
      currentResponse: null,
    });
  }
  return state;
};
