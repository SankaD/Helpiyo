import { connect } from 'react-redux';
import * as actions from './actions';

import component from './component';

const mapState = state => ({
  email: state.modules.auth.signUp.email,
  password: state.modules.auth.signUp.password,
  heroName: state.modules.auth.signUp.heroName,
  phoneNumber: state.modules.auth.signUp.phoneNumber,
  emailError: state.modules.auth.signUp.emailError,
  passwordError: state.modules.auth.signUp.passwordError,
  heroNameError: state.modules.auth.signUp.heroNameError,
  phoneNumberError: state.modules.auth.signUp.phoneNumberError,
  submitting: state.modules.auth.signUp.submitting,
});

const mapDispatch = dispatch => ({
  signUp: (email, phoneNumber, heroName, password) => dispatch(actions.signUp(email, phoneNumber, heroName, password)),
  goToSignIn: () => dispatch(actions.goToSignIn()),
});

export default connect(mapState, mapDispatch)(component);
