import { connect } from 'react-redux';
import * as actions from './actions';
import * as profileActions from '../../profiles/actions';
import * as requestActions from '../../requests/actions';
import * as commentActions from '../../comments/actions';

import component from './component';

const mapState = state => ({
  responses: state.modules.home.responses.myResponses,
  reloadResponses: state.modules.home.responses.reloadResponses,
  refreshing: state.modules.home.responses.refreshing,
  ratingModalVisible: state.modules.home.responses.ratingModalVisible,
  ratingError: state.modules.home.responses.ratingError,
  commentError: state.modules.home.responses.commentError,
  miscError: state.modules.home.responses.miscError,
  currentResponseId: state.modules.home.responses.currentResponseId,
});

const mapDispatch = dispatch => ({
  loadResponses: () => dispatch(actions.getMyResponses()),
  showRatingModal: responseId => dispatch(actions.showRatingModal(responseId)),
  hideRatingModal: () => dispatch(actions.hideRatingModal()),
  saveRating: (responseId, rating, comment) => dispatch(actions.completeResponse(responseId, rating, comment)),
  showProfile: profileId => dispatch(profileActions.showProfile(profileId)),
  deleteResponse: responseId => dispatch(actions.deleteResponse(responseId)),
  showRequest: requestId => dispatch(requestActions.showRequest(requestId)),
  editResponse: responseData => dispatch(actions.editResponse(responseData)),
  showComments: (targetType, targetId) => dispatch(commentActions.showCommentView(targetType, targetId)),
});

export default connect(mapState, mapDispatch)(component);
