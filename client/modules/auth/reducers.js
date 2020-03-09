import { combineReducers } from 'redux';

import signInReducer from './sign_in_page/reducer';
import signUpReducer from './sign_up_page/reducer';
import verifyReducer from './verify_page/reducer';
import resetReducer from './reset/reducer';

export default combineReducers({
  signIn: signInReducer,
  signUp: signUpReducer,
  verify: verifyReducer,
  reset: resetReducer,
});
