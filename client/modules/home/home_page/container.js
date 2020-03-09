import { connect } from 'react-redux';
import { reloadFeed } from '../feed/actions';
import { finishTutorial } from '../../global/actions';
import * as actions from './actions';

import component from './component';

const mapState = state => ({
  tutorialWanted: state.modules.global.newProfile,
});

const mapDispatch = dispatch => ({
  reloadFeed: () => dispatch(reloadFeed()),
  finishTutorial: () => dispatch(finishTutorial()),
  subscribeToBranch: () => dispatch(actions.subscribeToBranch()),
});

export default connect(mapState, mapDispatch)(component);
