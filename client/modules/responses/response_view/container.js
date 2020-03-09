import { connect } from 'react-redux';
import * as actions from '../actions';
import * as profileActions from '../../profiles/actions';
import * as commentActions from '../../comments/actions';
import * as requestActions from '../../requests/actions';

import component from './component';
import { showImage } from '../../image_view/actions';

const mapState = state => ({
  currentProfileId: state.modules.global.profile._id,
  currentLocation: state.modules.home.feed.lastLocation,
});

const mapDispatch = (dispatch, ownProps) => ({
  showProfile: profileId => dispatch(profileActions.showProfile(profileId)),
  showComments: responseId => dispatch(commentActions.showCommentView('response', responseId)),
  showRequest: requestId => dispatch(requestActions.showRequest(requestId)),
  acceptResponse: responseId => dispatch(actions.acceptResponse(responseId)),
  rejectResponse: responseId => dispatch(actions.rejectResponse(responseId)),
  completeResponse: responseId => dispatch(actions.completeResponse(responseId)),
  showImage: uri => dispatch(showImage(uri)),
  showElement: responseId => dispatch(!ownProps.showElement ? actions.showResponse(responseId) : (dispatch) => {}),
});

export default connect(mapState, mapDispatch)(component);
