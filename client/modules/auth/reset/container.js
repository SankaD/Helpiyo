import { connect } from 'react-redux';
import * as actions from './actions';

import component from './component';

const mapState = state => ({
  email: state.modules.auth.signIn.email,
  emailError: state.modules.auth.signIn.emailError,
});

const mapDispatch = dispatch => ({
  resetPassword: email => dispatch(actions.resetPassword(email)),
  goToSignIn: () => dispatch(actions.goToSignIn()),
});

export default connect(mapState, mapDispatch)(component);
