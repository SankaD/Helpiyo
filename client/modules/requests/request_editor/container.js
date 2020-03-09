import { connect } from 'react-redux';
import * as actions from '../actions';

import component from './component';

const mapState = state => ({
  request: state.modules.requests.currentRequest,
  errors: state.modules.requests.requestEditorErrors,
  needToUploadImages: state.modules.requests.needToUploadImages,
  elementSaved: state.modules.requests.requestSaved,
  sos: state.modules.requests.sos,
  submitting: state.modules.requests.submitting,
});

const mapDispatch = dispatch => ({
  saveElement: requestData => dispatch(actions.saveElement(requestData)),
});

export default connect(mapState, mapDispatch)(component);
