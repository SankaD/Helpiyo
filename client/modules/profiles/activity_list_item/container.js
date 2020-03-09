import { connect } from 'react-redux';

import component from './component';
import { showProfile } from '../actions';
import { showRequest } from '../../requests/actions';
import { showResponse } from '../../responses/actions';

const mapState = state => ({
});

const mapDispatch = dispatch => ({
  showProfile: profileId => dispatch(showProfile(profileId)),
  showRequest: requestId => dispatch(showRequest(requestId)),
  showResponse: responseId => dispatch(showResponse(responseId)),
});

export default connect(mapState, mapDispatch)(component);
