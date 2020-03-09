import { networkGet, networkPost } from '../../utils/url_helper';
import logger from '../../utils/logger';

const CommentHandler = {
  createComment: commentData => networkPost('comments/create', JSON.stringify(commentData)),
  getCommentsFor: (targetId, targetType) => networkGet(`comments/get-comments-for/${targetType}/${encodeURIComponent(targetId)}`)
    .then((result) => {
      logger.info(result);
      const { comments, profiles } = result.results;
      comments.forEach((comment) => {
        comment.createdBy = comment.from;
        comment.creator = profiles[comment.createdBy];
      });
      return comments;
    }),
};

module.exports = CommentHandler;
