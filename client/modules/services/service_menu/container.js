import { connect } from 'react-redux';
import component from './component';
import * as actions from '../actions';
import { showReporter } from '../../reporter/actions';
import { openThreadForUser } from '../../messages/actions';

const mapState = state => ({
  profileId: state.modules.global.profile._id,
});
const mapDispatch = dispatch => ({
  loadEditServicePage: service => dispatch(actions.loadServiceEditor(service)),
  deleteService: serviceId => dispatch(actions.deleteService(serviceId)),
  loadReporterPage: serviceId => dispatch(showReporter(serviceId, 'request')),
  shareService: (service, profileId) => dispatch(actions.shareService(service, profileId)),
});

export default connect(mapState, mapDispatch)(component);
