import { NavigationActions } from 'react-navigation';
import { networkGet, networkPost } from '../utils/url_helper';
import Toast from '../utils/toast';
import * as types from './types';
import * as titleBarActions from '../common/title_bar/title_bar.actions';
import * as profileTypes from '../profiles/types';
import Logger from '../utils/logger';

export function loadNotifications() {
  Logger.info('loading notifications');
  return (dispatch) => {
    dispatch({ type: types.LOAD_NOTIFICATIONS });
    networkGet('notifications/get-notifications')
      .then(result => result.notifications)
      .then(notifications => notifications.map((notification) => {
        let content = '';
        const userId = notification.to;
        const target = notification.from;
        let targetType = '';
        if (notification.type === 'create-response') {
          content = 'A response is created for your request';
          // userId = notification.responseCreator;
          // target = notification.responseId;
          targetType = 'response';
        } else if (notification.type === 'complete-response') {
          content = 'A response is completed for your request';
          // userId = notification.responseCreator;
          // target = notification.responseId;
          targetType = 'response';
        } else if (notification.type === 'complete-request') {
          content = 'A request you responded has been completed';
          // userId = notification.requestCreator;
          // target = notification.requestId;
          targetType = 'request';
        } else if (notification.type === 'accept-response') {
          content = 'A response you created has been accepted';
          // userId = notification.requestCreator;
          // target = notification.requestId;
          targetType = 'response';
        } else if (notification.type === 'reject-response') {
          content = 'A response you created has been rejected';
          // userId = notification.requestCreator;
          // target = notification.requestId;
          targetType = 'response';
        } else if (notification.type === 'follows') {
          content = 'A user followed you';
          targetType = 'profile';
        } else if (notification.type === 'award-badge') {
          content = 'You have been awarded a badge';
          targetType = 'badge';
        } else {
          content = 'Some notification';
        }
        return Object.assign({}, notification, {
          content, userId, target, targetType,
        });
      }))
      .then((notifications) => {
        dispatch({ type: types.NOTIFICATIONS_LOADED, notifications });
      })
      .catch((error) => {
        Logger.error(error);
        dispatch({ type: types.LOAD_NOTIFICATIONS_FAILED });
        Toast.error('Loading notifications failed');
      });
  };
}

export function clearNotifications() {
  return (dispatch) => {
    networkGet('notifications/clear-notifications')
      .then(() => {
        dispatch({ type: types.NOTIFICATIONS_CLEARED });
      })
      .catch((error) => {
        Logger.error(error);
        dispatch({ type: types.CLEAR_NOTIFICATIONS_FAILED });
        Toast.error('Clearing notifications failed');
      });
  };
}

export function markAsRead(notificationId) {
  return (dispatch) => {
    networkPost('notifications/mark-notification', JSON.stringify({ notificationId }))
      .then(() => {
        dispatch({ type: types.MARKED_AS_READ });
        dispatch(titleBarActions.getNotificationCount());
      })
      .catch((error) => {
        Logger.error(error);
        dispatch({ type: types.MARK_AS_READ_FAILED });
      });
  };
}

export function markMessageAsRead(threadId) {
  return (dispatch) => {
    networkPost('notifications/mark-message-thread', JSON.stringify({ threadId }))
      .then(() => {
        dispatch({ type: types.MARKED_AS_READ });
        dispatch(titleBarActions.getMessageCount());
      })
      .catch((error) => {
        Logger.error(error);
        dispatch({ type: types.MARK_AS_READ_FAILED });
      });
  };
}

export function goToBadges() {
  return (dispatch, getState) => {
    dispatch({ type: profileTypes.LOAD_PROFILE, profileId: getState().modules.global.profile._id });
    dispatch(NavigationActions.navigate({ routeName: 'BadgeView', key: 'BadgeView' }));
  };
}

