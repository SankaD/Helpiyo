import { connect } from 'react-redux';
import * as actions from '../actions';

import component from './component';

const mapState = state => ({
  requests: state.modules.requests.requests,
  reloadRequests: state.modules.requests.reloadRequests,
  refreshing: state.modules.requests.refreshing,
  serviceId: state.modules.requests.serviceId,
});

const mapDispatch = dispatch => ({
  loadRequests: serviceId => dispatch(actions.getRequestsForService(serviceId)),
});

export default connect(mapState, mapDispatch)(component);

