import { connect } from 'react-redux';
import * as actions from './actions';
import * as requestActions from '../../requests/actions';

import component from './component';

const mapState = state => ({
  requests: state.modules.home.map.requests,
  shouldReloadData: state.modules.home.map.shouldReloadData,
  currentProfileId: state.modules.global.profile._id,
});

const mapDispatch = dispatch => ({
  getNearByRequests: (latitude, longitude, radius) => dispatch(actions.getNearestRequests(latitude, longitude, radius)),
  showRequest: requestId => dispatch(requestActions.showRequest(requestId)),
});

export default connect(mapState, mapDispatch)(component);
