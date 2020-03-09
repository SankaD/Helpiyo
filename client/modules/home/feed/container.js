import { connect } from 'react-redux';
import * as actions from './actions';
import * as profileActions from '../../profiles/actions';
import { showReporter } from '../../reporter/actions';
import * as commentActions from '../../comments/actions';
import { showResponsesForRequest } from '../requests/actions';

import component from './component';

const mapState = state => ({
  refreshing: state.modules.home.feed.refreshing,
  shouldReloadFeed: state.modules.home.feed.shouldReloadFeed,
  miscError: state.modules.home.feed.miscError,
  feed: state.modules.home.feed.feed,
  currentProfileId: state.modules.global.profile ? state.modules.global.profile._id : null,
});

const mapDispatch = dispatch => ({
  loadFeed: (latitude, longitude) => dispatch(actions.loadFeed(latitude, longitude)),
  acceptRequest: request => dispatch(actions.acceptRequest(request)),
  showProfile: profileId => dispatch(profileActions.showProfile(profileId)),
  showReportView: (id, type) => dispatch(showReporter(id, type)),
  showComments: (targetType, targetId) => dispatch(commentActions.showCommentView(targetType, targetId)),
  promote: requestId => dispatch(actions.promote(requestId)),
  showResponses: requestId => dispatch(showResponsesForRequest(requestId)),
  reloadFeed: () => dispatch(actions.reloadFeed()),
});

export default connect(mapState, mapDispatch)(component);
