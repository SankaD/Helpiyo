import * as types from './types';

export default (state = {}, action) => {
  if (action.type === types.SIGN_UP_FAILED) {
    return Object.assign({}, state, {
      emailError: action.emailError,
      passwordError: action.passwordError,
      phoneNumberError: action.phoneNumberError,
      heroNameError: action.heroNameError,
      submitting: false,
    });
  }
  if (action.type === types.SIGN_UP) {
    return Object.assign({}, state, {
      emailError: '',
      passwordError: '',
      phoneNumberError: '',
      heroNameError: '',
      submitting: true,
    });
  }
  if (action.type === types.SIGNED_UP) {
    return Object.assign({}, state, {
      emailError: '',
      passwordError: '',
      phoneNumberError: '',
      heroNameError: '',
      submitting: false,
    });
  }
  return Object.assign({}, state, {});
};
