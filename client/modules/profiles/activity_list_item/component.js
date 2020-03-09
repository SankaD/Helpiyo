import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import commonStyles from '../../common/styles';

export default class ActivityListItem extends Component {
  static renderIcon(activity) {
    if (activity.target.includes('Profile/')) {
      return (
        <Icon name="face" color="#AAA" size={24} style={styles.icon} />
      );
    } if (activity.target.includes('Request/')) {
      return (
        <Icon name={commonStyles.icons.request} color="#EAA" size={24} style={styles.icon} />
      );
    } if (activity.target.includes('Response/')) {
      return (
        <Icon name={commonStyles.icons.response} color="#AEA" size={24} style={styles.icon} />
      );
    }
    return (
      <Icon name="help" color="#AAA" size={24} style={styles.icon} />
    );
  }

  getMethod(activity) {
    if (activity.target.includes('Profile/')) {
      return this.props.showProfile;
    } if (activity.target.includes('Request/')) {
      return this.props.showRequest;
    } if (activity.target.includes('Response/')) {
      return this.props.showResponse;
    }
    return null;
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.activity}
        onPress={() => this.getMethod(this.props.element)(this.props.element.target)}
      >
        <View style={styles.activityView}>
          {ActivityListItem.renderIcon(this.props.element)}
          <Text style={styles.activityText}>{this.props.element.text}</Text>
          <Text style={styles.activityTime}>{moment(this.props.element.modifiedOn).local().fromNow()}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

ActivityListItem.propTypes = {
  element: PropTypes.object.isRequired,
  showProfile: PropTypes.func.isRequired,
  showRequest: PropTypes.func.isRequired,
  showResponse: PropTypes.func.isRequired,
};
