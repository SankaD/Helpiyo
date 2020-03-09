import { connect } from 'react-redux';
import * as actions from '../actions';
import * as profileActions from '../../profiles/actions';
import * as commentActions from '../../comments/actions';
import { showImage } from '../../image_view/actions';

import component from './component';

const mapState = state => ({
  currentProfileId: state.modules.global.profile._id,
  currentLocation: state.modules.home.feed.lastLocation,
  inPromotion: state.modules.requests.inPromotion,
});

const mapDispatch = (dispatch, ownProps) => ({
  showProfile: profileId => dispatch(profileActions.showProfile(profileId)),
  showComments: requestId => dispatch(commentActions.showCommentView('request', requestId)),
  promote: requestId => dispatch(actions.promote(requestId)),
  showResponses: requestId => dispatch(actions.showResponsesForRequest(requestId)),
  acceptRequest: request => dispatch(actions.acceptRequest(request)),
  completeRequest: requestId => dispatch(actions.completeRequest(requestId)),
  showImage: uri => dispatch(showImage(uri)),
  showElement: requestId => dispatch(!ownProps.showElement ? actions.showRequest(requestId) : (dispatch) => {}),
});

export default connect(mapState, mapDispatch)(component);
