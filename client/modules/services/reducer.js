import * as types from './types';

const emptyService = {
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
};

const initialState = {
  currentService: null,
  services: [],
  submitting: false,
  errors: {},
  refreshing: false,
  tobeRefreshed: false,
  profile: null,
  inPromotion: [],
};

export default (state = initialState, action) => {
  if (action.type === types.LOAD_SERVICES) {
    return Object.assign({}, state, {
      // services: [],
      refreshing: true,
      tobeRefreshed: false,
    });
  }
  if (action.type === types.CREATE_SERVICE) {
    return Object.assign({}, state, {
      submitting: true,
    });
  }
  if (action.type === types.SERVICE_CREATED) {
    return Object.assign({}, state, {
      submitting: false,
      tobeRefreshed: true,
    });
  }
  if (action.type === types.SHOW_SERVICE_EDITOR) {
    return Object.assign({}, state, {
      currentService: action.service || emptyService,
      errors: {},
    });
  }
  if (action.type === types.CREATE_SERVICE_FAILED) {
    return Object.assign({}, state, {
      submitting: false,
      errors: action.errors,
    });
  }
  if (action.type === types.SERVICES_LOADED) {
    return Object.assign({}, state, {
      services: action.services,
      refreshing: false,
    });
  }
  if (action.type === types.LOAD_SERVICES_FAILED) {
    return Object.assign({}, state, {
      services: [],
      refreshing: false,
    });
  }
  if (action.type === types.SHOW_SERVICE_LIST) {
    return Object.assign({}, state, {
      profile: action.profile,
      refreshing: true,
      services: [],
    });
  }
  if (action.type === types.SERVICE_TOGGLED) {
    return Object.assign({}, state, {
      tobeRefreshed: true,
    });
  }
  if (action.type === types.SERVICE_UPDATED) {
    return Object.assign({}, state, {
      submitting: false,
      tobeRefreshed: true,
    });
  }
  if (action.type === types.UPDATE_SERVICE) {
    return Object.assign({}, state, {
      submitting: true,
    });
  }
  if (action.type === types.UPDATE_SERVICE_FAILED) {
    return Object.assign({}, state, {
      submitting: true,
      errors: action.errors,
    });
  }
  if (action.type === types.PROMOTE_SERVICE) {
    return Object.assign({}, state, {
      inPromotion: [...state.inPromotion, action.serviceId],
    });
  }
  if (action.type === types.SERVICE_PROMOTED) {
    return Object.assign({}, state, {
      inPromotion: state.inPromotion.filter(id => id !== action.serviceId),
      tobeRefreshed: true,
    });
  }
  if (action.type === types.PROMOTE_SERVICE_FAILED) {
    return Object.assign({}, state, {
      inPromotion: state.inPromotion.filter(id => id !== action.serviceId),
    });
  }
  if (action.type === types.SERVICE_DELETED) {
    return Object.assign({}, state, {
      tobeRefreshed: true,
    });
  }
  if (action.type === types.LOAD_SERVICE) {
    return Object.assign({}, state, {
      serviceId: action.serviceId,
      tobeRefreshed: false,
      errors: {},
    });
  }
  if (action.type === types.SERVICE_LOADED) {
    return Object.assign({}, state, {
      currentService: action.service,
    });
  }
  if (action.type === types.LOAD_SERVICE_FAILED) {
    return Object.assign({}, state, {
      currentService: null,
    });
  }
  if (action.type === types.SHOW_SERVICE) {
    return Object.assign({}, state, {
      serviceId: action.serviceId,
    });
  }
  return Object.assign({}, state);
};
