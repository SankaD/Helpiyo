import { connect } from 'react-redux';
import * as actions from './actions';
import * as requestActions from '../requests/actions';
import * as profileActions from '../profiles/actions';
import { showResponse } from '../responses/actions';

import component from './component';

const mapState = state => ({
  notifications: state.modules.notifications.notifications,
  refreshing: state.modules.notifications.refreshing,
});

const mapDispatch = dispatch => ({
  loadNotifications: () => dispatch(actions.loadNotifications()),
  markAsRead: notificationId => dispatch(actions.markAsRead(notificationId)),
  clearNotifications: () => dispatch(actions.clearNotifications()),
  showRequest: id => dispatch(requestActions.showRequest(id)),
  showProfile: id => dispatch(profileActions.showProfile(id)),
  showResponse: id => dispatch(showResponse(id)),
  goToBadges: () => dispatch(actions.goToBadges()),
});

export default connect(mapState, mapDispatch)(component);
