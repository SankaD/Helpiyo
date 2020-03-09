import * as types from './types';

const initialState = {
  elementId: null, elementCategory: null, errors: {}, elementType: null,
};

export default (state = initialState, action) => {
  if (action.type === types.REPORT_ITEM) {
    return Object.assign({}, state, {
      elementId: action.elementId,
      elementType: action.elementType,
    });
  } else if (action.type === types.REPORT_ITEM_FAILED) {
    return Object.assign({}, state, {
      errors: action.error,
    });
  }

  return Object.assign({}, state);
};
