import * as types from '../types';

const emptyResponse = {
  post: '',
  currency: 'USD',
  money: 0,
  locationName: '',
  latitude: undefined,
  longitude: undefined,
  startTime: undefined,
  endTime: undefined,
  photos: [],
};

const initialState = {
  currentResponse: Object.assign({}, emptyResponse),
  responseEditorErrors: {},
  needToUploadImages: false,
  responseSaved: false,
  submitting: false,
};

export default (state = initialState, action) => {
  if (action.type === types.CREATE_RESPONSE) {
    const { request } = action;
    let time = null;
    if (request.startTime) {
      time = new Date(request.startTime);
      if (time.getTime() < Date.now()) {
        time = new Date();
      }
    }
    const newResponse = Object.assign({}, emptyResponse, {
      requestId: request._id,
      post: '',
      currency: request.currency,
      money: request.money,
      locationName: request.locationName,
      latitude: request.latitude,
      longitude: request.longitude,
      startTime: time,
      endTime: request.endTime,
      photos: [],
    });

    return Object.assign({}, state, {
      currentResponse: newResponse,
      needToUploadImages: false,
      responseSaved: false,
      responseEditorErrors: {},
    });
  } else if (action.type === types.CREATE_RESPONSE_FAILED) {
    return Object.assign({}, state, {
      responseEditorErrors: action.errors,
      submitting: false,
    });
  } else if (action.type === types.CREATING_RESPONSE) {
    return Object.assign({}, state, {
      responseEditorErrors: {},
      submitting: true,
    });
  } else if (action.type === types.ACTIVATING_RESPONSE) {
    return Object.assign({}, state);
  } else if (action.type === types.RESPONSE_CREATED) {
    return Object.assign({}, state, initialState, { submitting: false });
  } else if (action.type === types.LOAD_RESPONSES_FOR_REQUEST) {
    return Object.assign({}, state, {
      loadRequestsFor: action.requestId,
    });
  } else if (action.type === types.EDIT_RESPONSE) {
    return Object.assign({}, state, {
      currentResponse: action.response,
      responseEditorErrors: {},
      submitting: false,
    });
  } else if (action.type === types.RESPONSE_EDITED) {
    return Object.assign({}, state, {
      submitting: false,
    });
  } else if (action.type === types.EDIT_RESPONSE_FAILED) {
    return Object.assign({}, state, {
      responseEditorErrors: action.errors,
      submitting: false,
    });
  } else if (action.type === types.EDITING_RESPONSE) {
    return Object.assign({}, state, {
      submitting: true,
    });
  }
  return state;
};
