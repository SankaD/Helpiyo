import { connect } from 'react-redux';
import * as actions from '../actions';
import * as profileActions from '../../profiles/actions';

import component from './component';

const mapState = state => ({
  responseId: state.modules.responses.responsePage.responseId,
  response: state.modules.responses.responsePage.currentResponse,
});

const mapDispatch = dispatch => ({
  showProfile: profileId => dispatch(profileActions.showProfile(profileId)),
  loadResponse: responseId => dispatch(actions.loadResponse(responseId)),
});

export default connect(mapState, mapDispatch)(component);
