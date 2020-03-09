import { connect } from 'react-redux';
import * as actions from '../actions';

import component from './component';

const mapState = state => ({
  errors: state.modules.services.errors,
  submitting: state.modules.services.submitting,
  service: state.modules.services.currentService,
});

const mapDispatch = dispatch => ({
  saveElement: serviceData => dispatch(actions.saveService(serviceData)),
});

export default connect(mapState, mapDispatch)(component);
