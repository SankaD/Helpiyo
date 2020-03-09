import { connect } from 'react-redux';
import component from './component';
import * as actions from '../actions';
import { showReporter } from '../../reporter/actions';
import { openThreadForUser } from '../../messages/actions';

const mapState = state => ({});
const mapDispatch = dispatch => ({
  loadEditResponsePage: responseId => dispatch(actions.loadEditResponsePage(responseId)),
  deleteResponse: responseId => dispatch(actions.deleteResponse(responseId)),
  loadReporterPage: responseId => dispatch(showReporter(responseId, 'response')),
  openChatForUser: profileId => dispatch(openThreadForUser(profileId)),
});

export default connect(mapState, mapDispatch)(component);
