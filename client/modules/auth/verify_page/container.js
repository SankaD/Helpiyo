import { connect } from 'react-redux';
import * as actions from './actions';
import { signOut } from '../../home/more/actions';

import component from './component';

const mapState = state => ({
  heroName: state.modules.auth.verify.heroName,
  heroNameError: state.modules.auth.verify.heroNameError,
  email: state.modules.auth.verify.email,
  submitting: state.modules.auth.verify.submitting,
  id: state.modules.auth.verify.id,
});

const mapDispatch = dispatch => ({
  createProfile: (email, heroName, id) => dispatch(actions.createProfile(email, heroName, id)),
  signOut: () => dispatch(signOut()),
});

export default connect(mapState, mapDispatch)(component);
