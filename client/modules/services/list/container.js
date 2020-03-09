import { connect } from 'react-redux';
import * as actions from '../actions';
import { openServiceCreator } from '../../common/action_button/action_button.actions';

import component from './component';

const mapState = state => ({
  services: state.modules.services.services,
  refreshing: state.modules.services.refreshing,
  profile: state.modules.services.profile,
  currentProfileId: state.modules.global.profile._id,
  tobeRefreshed: state.modules.services.tobeRefreshed,
});

const mapDispatch = dispatch => ({
  loadServices: profileId => dispatch(actions.getServices(profileId)),
  openServiceCreator: () => dispatch(openServiceCreator()),
});

export default connect(mapState, mapDispatch)(component);
