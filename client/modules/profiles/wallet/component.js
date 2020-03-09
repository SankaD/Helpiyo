import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import PropType from 'prop-types';
import moment from 'moment';
import commonStyles from '../../common/styles';
import MyProfileComponent from '../my_profile/component';
import styles from './styles';
import { Answers } from 'react-native-fabric';

export default class WalletPage extends Component {
    static navigationOptions={
      title: 'My Karma',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };
    componentWillMount() {
      this.props.loadData();
    }
    componentDidMount() {
      Answers.logCustom('load-page', { name: 'wallet-page' });
    }
    static renderListItem(item) {
      let elementType = '';
      switch (item.item.type) {
        case 'create-request':
          elementType = ' for creating a request';
          break;
        case 'create-request-sos':
          elementType = ' for creating an SOS request';
          break;
        case 'create-response':
          elementType = ' for responding to a request';
          break;
        case 'create-response-sos':
          elementType = ' for responding to an SOS request';
          break;
        case 'complete-request':
          elementType = ' for completing a request';
          break;
        case 'complete-request-sos':
          elementType = ' for completing an SOS request';
          break;
        case 'complete-response':
          elementType = ' for completing a response';
          break;
        case 'complete-response-sos':
          elementType = ' for completing a response';
          break;
        case 'follow-user':
          elementType = ' for following a user';
          break;
        case 'unfollow-user':
          elementType = ' for unfollowing a user';
          break;
        case 'being-followed':
          elementType = ' for being followed by someone';
          break;
        case 'being-unfollowed':
          elementType = ' for being unfollowed by someone';
          break;
        case 'early-adopter':
          elementType = ' for being an early adopter';
          break;
        case 'invites':
          elementType = ' for inviting someone to the app';
          break;
        case 'invited':
          elementType = ' for being invited by someone to the app';
          break;
        case 'boost-request':
          elementType = ' for boosting a request';
          break;
        case 'boost-service':
          elementType = ' for boosting a service';
          break;
        case 'daily-usage':
          elementType = ' for daily usage of the app';
          break;
        case 'continuous-daily-usage': // todo : implement
          elementType = ' for continuous daily usage of the app';
          break;
        case 'social-share': // added when someone views a shared link
          elementType = ' for sharing link on social media';
          break;
        case 'promote-request':
          elementType = ' for promoting a request';
          break;
        case 'demote-request':
          elementType = ' for demoting a request';
          break;
        case 'promote-service':
          elementType = ' for promoting a service';
          break;
        case 'demote-service':
          elementType = ' for demoting a service';
          break;
        case 'enable-service':
          elementType = ' for enabling a service';
          break;
        case 'disable-service':
          elementType = ' for disabling a service';
          break;
        case 'keep-request-open': // todo : implement
          elementType = ' for keeping a request open';
          break;
        case 'keep-service-open': // todo : implement
          elementType = ' for keeping a service open';
          break;
      }
      return (
        <View style={styles.element}>
          <Text style={item.item.value >= 0 ? styles.positiveValue : styles.negativeValue}>
            {item.item.value >= 0 ? `Added ${item.item.value}${elementType}` : `Removed ${-1 * item.item.value}${elementType}`}
          </Text>
          <Text style={styles.time}>{moment(item.item.createdOn).local().fromNow()}</Text>
        </View>
      );
    }
    render() {
      return (
        <View style={styles.container}>
          <View style={styles.topPanel}>
            <Text style={styles.label}>Current Karma </Text>
            <Text style={styles.karmaPoints}>{this.props.karmaPoints}</Text>
          </View>
          <View style={styles.bottomPanel}>
            <FlatList
              data={this.props.karmaActivity}
              renderItem={item => WalletPage.renderListItem(item)}
              keyExtractor={(item, index) => `${item.target}_${index}`}
              refreshing={this.props.refreshing}
              onRefresh={this.props.loadData}
              style={styles.list}
              contentContainerStyle={[{ flexGrow: 1 }, this.props.karmaActivity.length ? null : { justifyContent: 'center' }]}
              ListEmptyComponent={MyProfileComponent.renderEmptyView()}
            />
          </View>
        </View>
      );
    }
}

WalletPage.propTypes = {
  karmaPoints: PropType.number.isRequired,
  karmaActivity: PropType.array.isRequired,
  refreshing: PropType.bool.isRequired,
  loadData: PropType.func.isRequired,
};
