import { combineReducers } from 'redux';
import responsesForRequest from './responses_for_request/reducer';
import responseEditor from './response_editor/reducer';
import responsePage from './response_page/reducer';

export default combineReducers({
  responsesForRequest,
  responseEditor,
  responsePage,
});
