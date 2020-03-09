import { connect } from 'react-redux';
import * as actions from './actions';
import * as profileActions from '../../profiles/actions';
import * as commentActions from '../../comments/actions';
import * as messageActions from '../../messages/actions';
import { openRequestCreator } from '../../common/action_button/action_button.actions';

import component from './component';

const mapState = state => ({
  requests: state.modules.home.requests.myRequests,
  reloadRequests: state.modules.home.requests.reloadRequests,
  refreshing: state.modules.home.requests.refreshing,
  ratingModalVisible: state.modules.home.requests.ratingModalVisible,
  currentRequestId: state.modules.home.requests.currentRequestId,
  ratingError: state.modules.home.requests.ratingError,
  commentError: state.modules.home.requests.commentError,
  miscError: state.modules.home.requests.miscError,
});

const mapDispatch = dispatch => ({
  loadRequests: () => dispatch(actions.getMyRequests()),
  showResponses: requestId => dispatch(actions.showResponsesForRequest(requestId)),
  completeRequest: (requestId, rating, comment) => dispatch(actions.completeRequest(requestId, rating, comment)),
  showRatingModal: requestId => dispatch(actions.showRatingModal(requestId)),
  hideRatingModal: () => dispatch(actions.hideRatingModal()),
  showProfile: profileId => dispatch(profileActions.showProfile(profileId)),
  deleteRequest: requestId => dispatch(actions.deleteRequest(requestId)),
  editRequest: requestId => dispatch(actions.editRequest(requestId)),
  showComments: (targetType, targetId) => dispatch(commentActions.showCommentView(targetType, targetId)),
  openRequestCreator: () => dispatch(openRequestCreator()),
  showMessages: requestId => dispatch(messageActions.openThreadForRequest(requestId)),
});

export default connect(mapState, mapDispatch)(component);

