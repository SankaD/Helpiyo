import * as types from './types';

const initialState = {
  images: [],
  imageIndex: 0,
};

export default (state = initialState, action) => {
  if (action.type === types.SHOW_IMAGE) {
    return Object.assign({}, state, {
      images: action.images,
      imageIndex: action.imageIndex || 0,
    });
  }
  if (action.type === types.SHOW_IMAGE_FAILED) {
    return Object.assign({}, state, {
      images: [],
      imageIndex: 0,
    });
  }
  return state;
};
