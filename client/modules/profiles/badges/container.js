import { connect } from 'react-redux';
import component from './component';
import * as actions from '../actions';

const mapState = state => ({
  badges: state.modules.profiles.badges,
  profileId: state.modules.profiles.profileId,
  achievements: state.modules.profiles.achievements,
});

const mapDispatch = dispatch => ({
  loadBadges: profileId => dispatch(actions.loadAchievements(profileId)),
});

export default connect(mapState, mapDispatch)(component);
