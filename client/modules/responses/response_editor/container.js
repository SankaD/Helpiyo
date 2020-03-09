import { connect } from 'react-redux';

import * as actions from '../actions';

import component from './component';

const mapState = state => ({
  response: state.modules.responses.responseEditor.currentResponse,
  errors: state.modules.responses.responseEditor.responseEditorErrors,
  needToUploadImages: state.modules.responses.responseEditor.needToUploadImages,
  elementSaved: state.modules.responses.responseEditor.requestSaved,
  submitting: state.modules.responses.responseEditor.submitting,
});

const mapDispatch = dispatch => ({
  saveElement: responseData => dispatch(actions.saveElement(responseData)),
});

export default connect(mapState, mapDispatch)(component);
