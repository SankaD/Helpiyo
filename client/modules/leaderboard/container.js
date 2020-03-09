import { connect } from 'react-redux';
import * as actions from './actions';
import * as profileActions from '../profiles/actions';

import component from './component';

const mapState = state => ({
  globalList: state.modules.leaderboard.globalList,
  localList: state.modules.leaderboard.localList,
  loadingLocal: state.modules.leaderboard.loadingLocal,
  loadingGlobal: state.modules.leaderboard.loadingGlobal,
  globalListOffset: state.modules.leaderboard.globalListOffset,
  localListOffset: state.modules.leaderboard.localListOffset,
  endOfGlobalList: state.modules.leaderboard.endOfGlobalList,
  endOfLocalList: state.modules.leaderboard.endOfLocalList,
  currentProfileId: state.modules.global.profile._id,
});

const mapDispatch = dispatch => ({
  loadLeaderBoard: (offset, name) => dispatch(actions.loadLeaderBoard(offset, name)),
  showProfile: profileId => dispatch(profileActions.showProfile(profileId)),
});

export default connect(mapState, mapDispatch)(component);
