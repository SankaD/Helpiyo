import * as types from './types';
import * as ratingTypes from '../ratings/types';

const emptyRequest = {
  post: '',
  currency: 'USD',
  money: 0,
  locationName: undefined,
  location: { type: 'Point', coordinates: [0, 0] },
  locationSet: false,
  startTime: undefined,
  endTime: undefined,
  photos: [],
  tags: [],
  serviceId: undefined,
};

const initialState = {
  currentRequest: null,
  requestId: null,
  requestEditorErrors: {},
  needToUploadImages: false,
  requestSaved: false,
  sos: false,
  submitting: false,
  errors: {},
  inPromotion: [],
  serviceId: null,
  refreshing: false,
  requests: [],
  tobeRefreshed: false,
};

export default (state = initialState, action) => {
  if (action.type === types.LOAD_REQUESTS) {
    return Object.assign({}, state, {
      tobeRefreshed: false,
    });
  } else if (action.type === types.LOAD_REQUESTS_FAILED) {
    return Object.assign({}, state, {
      error: action.errors,
    });
  } else if (action.type === types.REQUESTS_LOADED) {
    return Object.assign({}, state, {
      requests: action.requests,
    });
  } else if (action.type === types.GET_MY_REQUESTS_FAILED) {
    return Object.assign({}, state, {
      error: action.errors,
    });
  } else if (action.type === types.CREATE_REQUEST_FAILED) {
    return Object.assign({}, state, {
      requestEditorErrors: action.errors,
      submitting: false,
    });
  } else if (action.type === types.CREATE_REQUEST) {
    return Object.assign({}, state, {
      currentRequest: Object.assign({}, emptyRequest, {
        currency: action.defaultCurrency,
        tags: [],
        serviceId: action.serviceId,
      }),
      needToUploadImages: false,
      requestSaved: false,
      requestEditorErrors: {},
      sos: action.sos,
      submitting: false,

    });
  } else if (action.type === types.UPLOAD_IMAGE) {
    return Object.assign({}, state, {
      needToUploadImages: true,
    });
  } else if (action.type === types.REQUEST_CREATED) {
    return Object.assign({}, state, {
      requestSaved: true,
      submitting: false,
    });
  } else if (action.type === types.SHOW_REQUEST) {
    return Object.assign({}, state, {
      requestId: action.requestId,
      currentRequest: null,
    });
  } else if (action.type === types.REQUEST_LOADED) {
    return Object.assign({}, state, {
      currentRequest: action.request,
    });
  } else if (action.type === types.EDIT_REQUEST) {
    return Object.assign({}, state, {
      currentRequest: action.request,
      requestEditorErrors: {},
      submitting: false,
    });
  } else if (action.type === types.REQUEST_EDITED) {
    return Object.assign({}, state, {
      requestSaved: true,
      submitting: false,
    });
  } else if (action.type === types.EDIT_REQUEST_FAILED) {
    return Object.assign({}, state, {
      requestEditorErrors: action.errors,
      submitting: false,
    });
  } else if (action.type === types.CREATING_REQUEST) {
    return Object.assign({}, state, {
      submitting: true,
      requestEditorErrors: {},
    });
  } else if (action.type === types.REQUEST_DELETED) {
    return Object.assign({}, state, {
      reloadRequests: true,
    });
  } else if (action.type === ratingTypes.COMPLETE_REQUEST) {
    return Object.assign({}, state, {
      ratingError: '',
      commentError: '',
      miscError: '',
    });
  } else if (action.type === ratingTypes.COMPLETE_REQUEST_FAILED) {
    return Object.assign({}, state, {
      ratingError: action.ratingError || '',
      commentError: action.commentError || '',
      miscError: action.miscError || '',
    });
  } else if (action.type === types.PROMOTE_REQUEST) {
    return Object.assign({}, state, {
      inPromotion: [...state.inPromotion, action.requestId],
    });
  } else if (action.type === types.REQUEST_PROMOTED) {
    return Object.assign({}, state, {
      inPromotion: state.inPromotion.filter(id => id !== action.requestId),
      tobeRefreshed: true,
    });
  } else if (action.type === types.PROMOTE_REQUEST_FAILED) {
    return Object.assign({}, state, {
      inPromotion: state.inPromotion.filter(id => id !== action.requestId),
    });
  } else if (action.type === types.SHOW_REQUESTS_FOR_SERVICE) {
    return Object.assign({}, state, {
      serviceId: action.serviceId,
    });
  } else if (action.type === types.LOAD_REQUESTS_FOR_SERVICE) {
    return Object.assign({}, state, {
      refreshing: true,
    });
  } else if (action.type === types.REQUESTS_FOR_SERVICE_LOADED) {
    return Object.assign({}, state, {
      requests: action.requests,
      refreshing: false,
    });
  } else if (action.type === types.LOAD_REQUESTS_FOR_SERVICE_FAILED) {
    return Object.assign({}, state, {
      refreshing: false,
    });
  }
  return Object.assign({}, state);
};
