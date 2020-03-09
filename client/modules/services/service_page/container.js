import { connect } from 'react-redux';
import * as actions from '../actions';
import * as profileActions from '../../profiles/actions';

import component from './component';

const mapState = state => ({
  serviceId: state.modules.services.serviceId,
  service: state.modules.services.currentService,
  tobeRefreshed: state.modules.services.tobeRefreshed,
});

const mapDispatch = dispatch => ({
  showProfile: profileId => dispatch(profileActions.showProfile(profileId)),
  loadService: serviceId => dispatch(actions.loadService(serviceId)),
});

export default connect(mapState, mapDispatch)(component);
