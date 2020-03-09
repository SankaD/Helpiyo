import { connect } from 'react-redux';
import * as actions from '../actions';

import component from './component';

const mapState = state => ({
  threads: state.modules.messages.threads,
  refreshing: state.modules.messages.refreshingThreads,
  currentProfileId: state.modules.global.profile._id,
});

const mapDispatch = dispatch => ({
  openThread: threadId => dispatch(actions.openThread(threadId)),
  loadThreads: () => dispatch(actions.getThreads()),
});

export default connect(mapState, mapDispatch)(component);
