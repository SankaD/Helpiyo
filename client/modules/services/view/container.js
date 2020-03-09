import { connect } from 'react-redux';
import * as actions from '../actions';
import { showProfile } from '../../profiles/actions';
import { showImage } from '../../image_view/actions';
import { gotoRequestsForService } from '../../requests/actions';
import component from './component';
import * as commentActions from '../../comments/actions';

const mapState = state => ({
  currentProfileId: state.modules.global.profile._id,
  inPromotion: state.modules.services.inPromotion,
  currentLocation: state.modules.home.feed.lastLocation,
});

const mapDispatch = (dispatch, ownProps) => ({
  showProfile: profileId => dispatch(showProfile(profileId)),
  showImage: uri => dispatch(showImage(uri)),
  createRequest: serviceId => dispatch(actions.createRequest(serviceId)),
  showRequests: serviceId => dispatch(gotoRequestsForService(serviceId)),
  toggleService: serviceId => dispatch(actions.toggleService(serviceId)),
  showComments: serviceId => dispatch(commentActions.showCommentView('service', serviceId)),
  promote: serviceId => dispatch(actions.promote(serviceId)),
  showElement: serviceId => dispatch(!ownProps.showElement ? actions.showService(serviceId) : (dispatch) => {}),
});

export default connect(mapState, mapDispatch)(component);
