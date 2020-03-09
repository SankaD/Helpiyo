import * as types from './types';

const initialState = {
  elementId: '',
  elementType: '',
  rating: 0,
  comment: '',
  ratingError: '',
  miscError: '',
  commentError: '',
  submitting: false,
  goBack: false,
};

export default (state = initialState, action) => {
  if (action.type === types.LOAD_RATING_PAGE) {
    return Object.assign({}, initialState, {
      elementId: action.elementId,
      elementType: action.elementType,
      goBack: false,
    });
  } else if (action.type === types.REQUEST_COMPLETED
      || action.type === types.RESPONSE_COMPLETED
      || action.type === types.RESPONSE_REJECTED) {
    return Object.assign({}, state, {
      ratingError: '',
      commentError: '',
      miscError: '',
      submitting: false,
      goBack: true,
    });
  } else if (action.type === types.COMPLETE_REQUEST_FAILED
      || action.type === types.COMPLETE_RESPONSE_FAILED
      || action.type === types.REJECT_RESPONSE_FAILED) {
    return Object.assign({}, state, {
      ratingError: action.ratingError,
      commentError: action.commentError,
      miscError: action.miscError,
      submitting: false,
    });
  } else if (action.type === types.COMPLETE_REQUEST
      || action.type === types.COMPLETE_RESPONSE
      || action.type === types.REJECT_RESPONSE) {
    return Object.assign({}, state, {
      submitting: true,
      ratingError: '',
      miscError: '',
      commentError: '',
    });
  }
  return Object.assign({}, state);
};
