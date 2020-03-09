import { connect } from 'react-redux';
import * as actions from './actions';

import component from './component';

const mapState = state => ({
  email: state.modules.auth.signIn.email,
  password: state.modules.auth.signIn.password,
  emailError: state.modules.auth.signIn.emailError,
  passwordError: state.modules.auth.signIn.passwordError,
  miscError: state.modules.auth.signIn.miscError,
  submitting: state.modules.auth.signIn.submitting,
});

const mapDispatch = dispatch => ({
  signIn: (email, password) => dispatch(actions.signIn(email, password)),
  goToSignUp: () => dispatch(actions.goToSignUp()),
  goToForgotPassword: () => dispatch(actions.goToForgotPassword()),
  signInWithGoogle: () => dispatch(actions.signInWithGoogle()),
  signInWithFacebook: () => dispatch(actions.signInWithFacebook()),
});

export default connect(mapState, mapDispatch)(component);
