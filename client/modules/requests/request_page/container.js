import { connect } from 'react-redux';
import * as actions from '../actions';
import * as profileActions from '../../profiles/actions';

import component from './component';

const mapState = state => ({
  requestId: state.modules.requests.requestId,
  request: state.modules.requests.currentRequest,
  tobeRefreshed: state.modules.requests.tobeRefreshed,
});

const mapDispatch = dispatch => ({
  showProfile: profileId => dispatch(profileActions.showProfile(profileId)),
  loadRequest: requestId => dispatch(actions.loadRequest(requestId)),
});

export default connect(mapState, mapDispatch)(component);
