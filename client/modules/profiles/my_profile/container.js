import { connect } from 'react-redux';
import component from './component';
import * as actions from '../actions';
import { showServices } from '../../services/actions';

const mapState = state => ({
  profile: state.modules.profiles.profile,
  profileId: state.modules.profiles.profileId,
  badges: state.modules.profiles.badges,
  refreshing: state.modules.profiles.refreshing,
  tobeRefreshed: state.modules.profiles.tobeRefreshed,
  loadingActivities: state.modules.profiles.loadingActivities,
  activities: state.modules.profiles.activities,
  nameChangeModalVisible: state.modules.profiles.nameChangeModalVisible,
  displayNameError: state.modules.profiles.displayNameError,
  changingHeroName: state.modules.profiles.changingHeroName,
});

const mapDispatch = dispatch => ({
  loadProfile: profileId => dispatch(actions.loadProfile(profileId)),
  showBadges: profileId => dispatch(actions.showAchievements(profileId)),
  uploadProfilePic: (profileId, imagePath) => dispatch(actions.uploadProfilePic(profileId, imagePath)),
  loadActivities: profileId => dispatch(actions.loadActivities(profileId)),
  hideNameChangeModal: () => dispatch(actions.hideDisplayNameModal()),
  showDisplayNameModal: displayName => dispatch(actions.openDisplayNameModal(displayName)),
  changeDisplayName: displayName => dispatch(actions.changeDisplayName(displayName)),
  showServices: profile => dispatch(showServices(profile)),
  showWallet: () => dispatch(actions.showWallet()),
});

export default connect(mapState, mapDispatch)(component);
