import { connect } from 'react-redux';
import { completeRequest, completeResponse, rejectResponse } from './actions';

import component from './component';

const mapState = state => ({
  elementId: state.modules.ratings.elementId,
  elementType: state.modules.ratings.elementType,
  rating: state.modules.ratings.rating,
  comment: state.modules.ratings.comment,
  ratingError: state.modules.ratings.ratingError,
  commentError: state.modules.ratings.commentError,
  miscError: state.modules.ratings.miscError,
  submitting: state.modules.ratings.submitting,
  goBack: state.modules.ratings.goBack,
});

const mapDispatch = dispatch => ({
  completeRequest: (requestId, rating, comment) => dispatch(completeRequest(requestId, rating, comment)),
  completeResponse: (responseId, rating, comment) => dispatch(completeResponse(responseId, rating, comment)),
  rejectResponse: (responseId, rating, comment) => dispatch(rejectResponse(responseId, rating, comment)),
});

export default connect(mapState, mapDispatch)(component);
