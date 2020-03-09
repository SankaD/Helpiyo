import { connect } from 'react-redux';
import component from './component';
import * as actions from '../actions';

const mapState = state => ({
  profileId: state.modules.profiles.profileId,
  karmaPoints: state.modules.profiles.karmaPoints,
  karmaActivity: state.modules.profiles.karmaActivity,
  refreshing: state.modules.profiles.karmaRefreshing,
});

const mapDispatch = dispatch => ({
  loadData: () => dispatch(actions.loadKarmaData()),
});

export default connect(mapState, mapDispatch)(component);
