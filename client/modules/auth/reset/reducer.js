import * as types from './types';

export default (state = {}, action) => {
  switch (action.type) {
    case types.RESET_PASSWORD:
      return Object.assign({}, state, {
        emailError: action.emailError,
      });
    default:
      return state;
  }
};
