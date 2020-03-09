import * as types from './types';

const initialState = {
  globalList: [],
  localList: [],
  loadingGlobal: false,
  loadingLocal: false,
  globalListOffset: 0,
  localListOffset: 0,
  endOfGlobalList: false,
  endOfLocalList: false,
};


export default (state = initialState, action) => {
  if (action.type === types.LOAD_GLOBAL_LEADERBOARD_FAILED) {
    return Object.assign({}, state, {
      loadingGlobal: false,
    });
  } else if (action.type === types.GLOBAL_LEADERBOARD_LOADED) {
    const list = action.offset === 0 ? [...action.list] : [...state.globalList, ...action.list];
    return Object.assign({}, state, {
      loadingGlobal: false,
      globalListOffset: action.offset,
      globalList: list,
      endOfGlobalList: action.isEnd,
    });
  } else if (action.type === types.LOAD_GLOBAL_LEADERBOARD) {
    const list = action.offset === 0 ? [] : [...state.globalList];
    return Object.assign({}, state, {
      loadingGlobal: true,
      globalList: list,
      endOfGlobalList: state.endOfGlobalList && action.offset !== 0,
    });
  } else if (action.type === types.LOAD_LOCAL_LEADERBOARD) {
    const list = action.offset === 0 ? [] : [...state.localList];
    return Object.assign({}, state, {
      loadingLocal: true,
      localList: list,
      endOfLocalList: state.endOfLocalList && action.offset !== 0,
    });
  } else if (action.type === types.LOCAL_LEADERBOARD_LOADED) {
    const list = action.offset === 0 ? [...action.list] : [...state.localList, ...action.list];
    return Object.assign({}, state, {
      loadingLocal: false,
      localListOffset: action.offset,
      localList: list,
      endOfLocalList: action.isEnd,
    });
  } else if (action.type === types.LOAD_LOCAL_LEADERBOARD_FAILED) {
    return Object.assign({}, state, {
      loadingLocal: false,
    });
  }
  return Object.assign({}, state);
};
