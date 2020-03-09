import { connect } from 'react-redux';

import component from './component';
import * as actions from '../actions';

const mapState = state => ({
});

const mapDispatch = dispatch => ({
  loadProfile: profileId => dispatch(actions.showProfile(profileId)),
});

export default connect(mapState, mapDispatch)(component);
