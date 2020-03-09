import moment from 'moment';
import React, { Component } from 'react';
import {
  FlatList, View, Text, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Answers } from 'react-native-fabric';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import Toast from '../utils/toast';
import Logger from '../utils/logger';
import commonStyles from '../common/styles';
import EmptyView from '../common/empty_view/component';

export default class NotificationView extends Component {
    static navigationOptions = {
      title: 'Notifications',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };

    componentDidMount() {
      Answers.logCustom('load-page', { name: 'notifications-page' });
    }

    componentWillMount() {
      this.props.loadNotifications();
    }

    showRequest(requestId) {
      this.props.showRequest(requestId);
    }

    showResponse(responseId) {
      this.props.showResponse(responseId);
    }

    showProfile(profileId) {
      this.props.showProfile(profileId);
    }

    showItem(notificationId, targetId, targetType) {
      Logger.info(`showing item : ${notificationId} : ${targetId} : ${targetType}`);
      if (!targetId) {
        Toast.warn('Target cannot be found');
        return;
      }
      if (targetType === 'request') {
        this.showRequest(targetId);
      } else if (targetType === 'response') {
        this.showResponse(targetId);
      } else if (targetType === 'profile') {
        this.showProfile(targetId);
      } else if (targetType === 'badge') {
        this.props.goToBadges();
      } else {
        Toast.error('Unidentified notification target type');
      }
      this.props.markAsRead(notificationId);
    }

    static renderEmptyView() {
      return (
        <EmptyView label1={"You don't have any unread notifications."} />
      );
    }

    static renderIcon(notification) {
      if (!notification.type) {
        return (
          <Icon name="help" color="#AAA" size={24} style={styles.icon} />
        );
      }
      if (notification.type.includes('profile')) {
        return (
          <Icon name="face" color="#AAA" size={24} style={styles.icon} />
        );
      } if (notification.type.includes('request')) {
        return (
          <Icon name={commonStyles.icons.requests} color="#EAA" size={24} style={styles.icon} />
        );
      } if (notification.type.includes('response')) {
        return (
          <Icon name={commonStyles.icons.responses} color="#AEA" size={24} style={styles.icon} />
        );
      } if (notification.type.includes('badge')) {
        return (
          <Icon name="trophy" color="#AAE" size={24} style={styles.icon} />
        );
      }
      return (
        <Icon name="help" color="#AAA" size={24} style={styles.icon} />
      );
    }

    renderNotification(item) {
      const notification = item.item;
      return (
        <TouchableOpacity onPress={() => this.showItem(notification._id, notification.target, notification.targetType)} style={styles.notification}>
          <View style={styles.notificationContainer}>
            {NotificationView.renderIcon(notification)}
            <Text style={styles.notificationContent}>{notification.content}</Text>
            <Text style={styles.notificationTime}>{moment(notification.modifiedOn).local().fromNow()}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    render() {
      return (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={this.props.notifications}
            renderItem={notification => this.renderNotification(notification)}
            keyExtractor={(item, index) => item._id}
            refreshing={this.props.refreshing}
            onRefresh={this.props.loadNotifications}
            style={styles.list}
            contentContainerStyle={[{ flexGrow: 1 }, this.props.notifications.length ? null : { justifyContent: 'center' }]}
            ListEmptyComponent={NotificationView.renderEmptyView()}
          />
        </SafeAreaView>
      );
    }
}

NotificationView.propTypes = {
  notifications: PropTypes.array.isRequired,
  clearNotifications: PropTypes.func.isRequired,
  loadNotifications: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  showProfile: PropTypes.func.isRequired,
  showRequest: PropTypes.func.isRequired,
  markAsRead: PropTypes.func.isRequired,
  showResponse: PropTypes.func.isRequired,
  goToBadges: PropTypes.func.isRequired,
};
