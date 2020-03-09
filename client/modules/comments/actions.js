import { NavigationActions } from 'react-navigation';
import { Answers } from 'react-native-fabric';
import Toast from '../utils/toast';
import CommentHandler from '../common/data_handlers/comment_handler';
import Logger from '../utils/logger';

import * as types from './types';

export function loadComments(targetId, targetType) {
  Logger.info('loading comments');
  return (dispatch) => {
    dispatch({ type: types.LOAD_COMMENTS });
    CommentHandler.getCommentsFor(targetId, targetType)
      .then((comments) => {
        dispatch({ type: types.COMMENTS_LOADED, comments });
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error('Loading comments failed');
        dispatch({ type: types.LOAD_COMMENTS_FAILED, error });
      });
  };
}

export function createComment(commentData, addedComment) {
  Logger.info('creating comment');
  return (dispatch) => {
    if (!commentData.comment) {
      return;
    }
    dispatch({ type: types.CREATE_COMMENT, addedComment });
    CommentHandler.createComment(commentData)
      .then((result) => {
        dispatch({ type: types.COMMENT_CREATED });
        Answers.logCustom('comment-creation', {
          targetType: commentData.targetType,
          targetId: commentData.targetId,
          commentType: commentData.commentType,
        });
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error('Creating comment failed');
        dispatch({ type: types.CREATE_COMMENT_FAILED, miscError: error });
      });
  };
}

export function showCommentView(targetType, targetId) {
  Logger.info('showing comments view');
  return (dispatch) => {
    dispatch({ type: types.SET_TARGET, targetType, targetId });
    dispatch(NavigationActions.navigate({ routeName: 'CommentView', key: 'CommentView' }));
  };
}
