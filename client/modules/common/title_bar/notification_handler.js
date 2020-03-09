import * as types from './title_bar.actiontypes';
import Logger from '../../utils/logger';

export default class NotificationHandler {
    static dispatch = null;
    static handleMessageNotification(notification) {
      Logger.info('message notification received');
      NotificationHandler.dispatch({ type: types.MESSAGE_RECEIVED, threadId: notification.threadId });
    }
    static handleGeneralNotification() {
      Logger.info('general notification received');
      NotificationHandler.dispatch({ type: types.NOTIFICATION_RECEIVED });
    }
    static handleSosNotification() {
      Logger.info('sos notification received');
      NotificationHandler.dispatch({ type: types.SOS_NOTIFICATION_RECEIVED });
    }
    static handleNotification(message) {
      Logger.info('notification received');
      const notification = message.data;
      if (notification.type === 'message') {
        NotificationHandler.handleMessageNotification(notification);
      } else if (notification.type === 'general') {
        NotificationHandler.handleGeneralNotification();
      } else if (notification.type === 'sos') {
        NotificationHandler.handleSosNotification();
      } else {
        Logger.info('unidentified notification');
      }
    }
}
