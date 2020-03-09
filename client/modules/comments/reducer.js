import * as types from './types';

const initialState = {
  refreshing: false,
  refreshList: false,
  comments: [],
  targetType: null,
  targetId: null,
  miscError: null,
};
export default function reducer(state = initialState, action) {
  if (action.type === types.SET_TARGET) {
    return Object.assign({}, state, {
      targetType: action.targetType,
      targetId: action.targetId,
      comments: [],
      refreshing: true,
      miscError: null,
    });
  } else if (action.type === types.LOAD_COMMENTS) {
    return Object.assign({}, state, {
      refreshing: true,
      miscError: null,
    });
  } else if (action.type === types.COMMENTS_LOADED) {
    return Object.assign({}, state, {
      refreshing: false,
      refreshList: false,
      comments: action.comments,
      miscError: null,
    });
  } else if (action.type === types.LOAD_COMMENTS_FAILED) {
    return Object.assign({}, state, {
      refreshing: false,
      refreshList: false,
      comments: [],
      miscError: action.miscError,
    });
  } else if (action.type === types.COMMENT_CREATED) {
    return Object.assign({}, state, {
      refreshList: true,
    });
  } else if (action.type === types.CREATE_COMMENT_FAILED) {
    return Object.assign({}, state, {
      refreshList: true,
    });
  } else if (action.type === types.CREATE_COMMENT) {
    return Object.assign({}, state, {
      comments: [...state.comments, action.addedComment],
    });
  }
  return state;
}
