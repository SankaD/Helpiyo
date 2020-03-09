import * as types from './title_bar.actiontypes';
import { NavigationActions } from 'react-navigation';
import { networkGet } from '../../utils/url_helper';
import Toast from '../../utils/toast';
import Logger from '../../utils/logger';

// export function showMenu(showMenu) {
//   return (dispatch) => {
//     dispatch(NavigationActions.navigate({ routeName: 'DrawerOpen' }));
//   };
// }
export function showMessages() {
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'ThreadView', key: 'ThreadView' }));
  };
}
export function showNotifications() {
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'NotificationView', key: 'NotificationView' }));
  };
}

export function discardSearchResults() {
  Logger.info('discarding search');
  return { type: types.DISCARD_SEARCH_RESULTS };
}

export function openNotifications() {
  Logger.info('opening notifications');
  return (dispatch) => {
    dispatch({ type: types.OPEN_NOTIFICATIONS });
  };
}

export function openSearchView() {
  Logger.info('opening search view');
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'SearchPage', key: 'SearchPage' }));
  };
}

export function openMessages() {
  Logger.info('opening messages');
  return (dispatch) => {
    dispatch({ type: types.OPEN_MESSAGES });
  };
}

export function getNotificationCount() {
  Logger.info('getting notification count');
  return (dispatch) => {
    dispatch({ type: types.GET_NOTIFICATION_COUNT });
    networkGet('notifications/get-notification-count')
      .then((result) => {
        dispatch({ type: types.NOTIFICATION_COUNT_RECEIVED, count: result.count });
      })
      .catch((error) => {
        Logger.error(error);
        Toast.warn('Loading notifications failed');
        dispatch({ type: types.GET_NOTIFICATION_COUNT_FAILED });
      });
  };
}

export function getMessageCount() {
  Logger.info('getting message count');
  return (dispatch) => {
    dispatch({ type: types.GET_MESSAGE_COUNT });
    networkGet('notifications/get-message-count')
      .then((result) => {
        dispatch({ type: types.MESSAGE_COUNT_RECEIVED, count: result.count });
      })
      .catch((error) => {
        Logger.error(error);
        Toast.warn('Loading messages failed');
        dispatch({ type: types.GET_MESSAGE_COUNT_FAILED });
      });
  };
}
