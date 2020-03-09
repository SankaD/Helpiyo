import { connect } from 'react-redux';
import * as actions from './actions';

import component from './component';

const mapState = state => ({
  targetId: state.modules.comments.targetId,
  targetType: state.modules.comments.targetType,
  refreshing: state.modules.comments.refreshing,
  comments: state.modules.comments.comments,
  currentProfile: state.modules.global.profile,
  refreshList: state.modules.comments.refreshList,
});

const mapDispatch = dispatch => ({
  createComment: (commentData, addedComment) => dispatch(actions.createComment(commentData, addedComment)),
  loadComments: (targetId, targetType) => dispatch(actions.loadComments(targetId, targetType)),
});

export default connect(mapState, mapDispatch)(component);
