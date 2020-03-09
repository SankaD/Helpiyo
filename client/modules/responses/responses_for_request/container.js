import { connect } from 'react-redux';

import * as actions from '../actions';
import * as profileActions from '../../profiles/actions';

import component from './component';
import { showReporter } from '../../reporter/actions';

const mapState = state => ({
  refreshing: state.modules.responses.responsesForRequest.refreshing,
  reload: state.modules.responses.responsesForRequest.reload,
  responses: state.modules.responses.responsesForRequest.responses,
  requestId: state.modules.responses.responsesForRequest.requestId,
  errors: state.modules.responses.responsesForRequest.errors,
  ratingError: state.modules.responses.responsesForRequest.ratingError,
  commentError: state.modules.responses.responsesForRequest.commentError,
  miscError: state.modules.responses.responsesForRequest.miscError,
});

const mapDispatch = dispatch => ({
  loadResponses: requestId => dispatch(actions.loadResponsesForRequest(requestId)),
  acceptResponse: responseId => dispatch(actions.acceptResponse(responseId)),
  showProfile: profileId => dispatch(profileActions.showProfile(profileId)),
  rejectResponse: (responseId, body) => dispatch(actions.rejectResponse(responseId, body)),
  showReportView: (id, type) => dispatch(showReporter(id, type)),
});

export default connect(mapState, mapDispatch)(component);
