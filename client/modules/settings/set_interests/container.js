import { connect } from 'react-redux';
import * as actions from '../actions';

import component from './component';

const mapState = state => ({
  interests: state.modules.settings.interests,
  refreshing: state.modules.settings.refreshing,
  tobeRefreshed: state.modules.settings.tobeRefreshed,
});
const mapDispatch = dispatch => ({
  setInterests: interests => dispatch(actions.setInterests(interests)),
  loadInterests: () => dispatch(actions.loadInterests()),
});

export default connect(mapState, mapDispatch)(component);
