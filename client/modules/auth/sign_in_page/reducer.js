import * as types from './types';

const initialState = {
  submitting: false,
  emailError: undefined,
  passwordError: undefined,
  miscError: undefined,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SIGN_IN_FAILED:
      return Object.assign({}, state, {
        emailError: action.emailError,
        passwordError: action.passwordError,
        miscError: action.miscError,
        submitting: false,
      });
    case types.SIGN_IN:
      return Object.assign({}, state, {
        emailError: undefined,
        passwordError: undefined,
        miscError: undefined,
        submitting: true,
      });
    case types.SIGNED_IN:
      return Object.assign({}, state, {
        emailError: undefined,
        passwordError: undefined,
        miscError: undefined,
        submitting: false,
      });
    default:
      return state;
  }
};
