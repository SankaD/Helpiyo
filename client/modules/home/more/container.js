import { connect } from 'react-redux';
import * as actions from './actions';
import * as profileActions from '../../profiles/actions';
import * as servicesActions from '../../services/actions';

import component from './component';

const mapState = state => ({
  profileId: state.modules.global.profile._id,
  profile: state.modules.global.profile,
});

const mapDispatch = dispatch => ({
  signOut: () => dispatch(actions.signOut()),
  showMessages: () => dispatch(actions.showMessages()),
  showProfile: profileId => dispatch(profileActions.showProfile(profileId)),
  showSettings: () => dispatch(actions.showSettings()),
  showLeaderboard: () => dispatch(actions.showLeaderboard()),
  inviteFriends: () => dispatch(actions.inviteFriends()),
  showAchievements: () => dispatch(actions.showAchievements()),
  showServices: profile => dispatch(servicesActions.showServices(profile)),
});

export default connect(mapState, mapDispatch)(component);
