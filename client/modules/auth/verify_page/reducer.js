import * as types from './types';

const initialState = {
  heroName: '',
  heroNameError: '',
  submitting: false,
  email: '',
  id: '',
};
export default (state = initialState, action) => {
  switch (action.type) {
    case types.CREATE_PROFILE:
      return Object.assign({}, state, {
        heroName: action.heroName,
        submitting: true,
      });
    case types.LOAD_PROFILE_CREATOR:
      return Object.assign({}, initialState, {
        email: action.email,
        id: action.id,
      });
    case types.PROFILE_CREATED:
      return Object.assign({}, state, {
        submitting: false,
      });
    case types.CREATE_PROFILE_FAILED:
      return Object.assign({}, state, {
        submitting: false,
        heroNameError: action.heroNameError,
      });
    default:
      return Object.assign({}, state, {});
  }
};
