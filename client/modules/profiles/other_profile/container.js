import { connect } from 'react-redux';
import component from './component';
import * as actions from '../actions';
import * as messageActions from '../../messages/actions';
import { showReporter } from '../../reporter/actions';
import { showServices } from '../../services/actions';

const mapState = state => ({
  profile: state.modules.profiles.profile,
  profileId: state.modules.profiles.profileId,
  following: state.modules.profiles.following,
  badges: state.modules.profiles.badges,
  refreshing: state.modules.profiles.refreshing,
  tobeRefreshed: state.modules.profiles.tobeRefreshed,
  loadingActivities: state.modules.profiles.loadingActivities,
  activities: state.modules.profiles.activities,
  submitting: state.modules.profiles.submitting,
});

const mapDispatch = dispatch => ({
  followProfile: profileId => dispatch(actions.followProfile(profileId)),
  unfollowProfile: profileId => dispatch(actions.unfollowProfile(profileId)),
  isFollowing: profileId => dispatch(actions.isFollowing(profileId)),
  loadProfile: profileId => dispatch(actions.loadProfile(profileId)),
  openThread: profileId => dispatch(messageActions.openThreadForUser(profileId)),
  showBadges: profileId => dispatch(actions.showAchievements(profileId)),
  loadActivities: profileId => dispatch(actions.loadActivities(profileId)),
  showReporter: profileId => dispatch(showReporter(profileId, 'profile')),
  showServices: profile => dispatch(showServices(profile)),
});

export default connect(mapState, mapDispatch)(component);
