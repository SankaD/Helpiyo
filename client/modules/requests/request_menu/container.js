import { connect } from 'react-redux';
import component from './component';
import * as actions from '../actions';
import { showReporter } from '../../reporter/actions';
import { openThreadForUser } from '../../messages/actions';

const mapState = state => ({
  profileId: state.modules.global.profile._id,
});
const mapDispatch = dispatch => ({
  loadEditRequestPage: requestId => dispatch(actions.loadEditRequestPage(requestId)),
  deleteRequest: requestId => dispatch(actions.deleteRequest(requestId)),
  loadReporterPage: requestId => dispatch(showReporter(requestId, 'request')),
  openChatForUser: profileId => dispatch(openThreadForUser(profileId)),
  boostRequest: requestId => dispatch(actions.boostRequest(requestId)),
  shareRequest: (request, profileId) => dispatch(actions.shareRequest(request, profileId)),
});

export default connect(mapState, mapDispatch)(component);
