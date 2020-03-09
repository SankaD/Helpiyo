import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import { Answers } from 'react-native-fabric';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import commonStyles from '../../common/styles';
import { inviteFriends } from './actions';

export default class MorePageComponent extends Component {
    static navigationOptions = {
      tabBarIcon: ({ tintColor }) => (<Icon name="arrow-up-drop-circle-outline" size={24} color={tintColor} />),
      tabBarLabel: ({ focused, tintColor }) => (focused ? <Text style={{ color: tintColor, fontSize: 10 }}>More</Text> : null),
      header: null,
    };

    constructor(props) {
      super(props);
      this.state = {};
      this.signOut = this.signOut.bind(this);
    }
    componentDidMount() {
      Answers.logCustom('load-page', { name: 'more-page' });
      if (!this.props.profile.introDone) {
        this.props.inviteFriends();
      }
    }
    signOut() {
      Alert.alert(
        'Sign out',
        'Are you sure you want to sign out?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'OK',
            onPress: () => {
              this.props.signOut();
            },
          },
        ],
      );
    }


    render() {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.menu} contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
            <TouchableHighlight style={styles.menuButton} onPress={this.props.showLeaderboard} underlayColor="#EEE">
              <View style={styles.menuItem}>
                <Icon name="account-star" size={20} style={styles.icon} />
                <Text style={styles.menuItemLabel}>Hero Rankings</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.menuButton} onPress={this.props.showAchievements} underlayColor="#EEE">
              <View style={styles.menuItem}>
                <Icon name="trophy" size={20} style={styles.icon} />
                <Text style={styles.menuItemLabel}>Achievements</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.menuButton} onPress={() => this.props.showServices(this.props.profile)} underlayColor="#EEE">
              <View style={styles.menuItem}>
                <Icon name={commonStyles.icons.services} size={20} style={styles.icon} />
                <Text style={styles.menuItemLabel}>My Services</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.menuButton} onPress={() => this.props.showProfile(this.props.profileId)} underlayColor="#EEE">
              <View style={styles.menuItem}>
                <Icon name="face" size={20} style={styles.icon} />
                <Text style={styles.menuItemLabel}>My Profile</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.menuButton} onPress={this.props.showSettings} underlayColor="#EEE">
              <View style={styles.menuItem}>
                <Icon name="settings" size={20} style={styles.icon} />
                <Text style={styles.menuItemLabel}>Settings</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.menuButton} onPress={this.props.inviteFriends} underlayColor="#EEE">
              <View style={styles.menuItem}>
                <Icon name="share-variant" size={20} style={styles.icon} />
                <Text style={styles.menuItemLabel}>Invite friends</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.menuButton} onPress={this.signOut} underlayColor="#EEE">
              <View style={styles.menuItem}>
                <Icon name="logout" size={20} style={styles.icon} />
                <Text style={styles.menuItemLabel}>Sign Out</Text>
              </View>
            </TouchableHighlight>
          </ScrollView>
        </View>
      );
    }
}

MorePageComponent.propTypes = {
  signOut: PropTypes.func.isRequired,
  showMessages: PropTypes.func.isRequired,
  showProfile: PropTypes.func.isRequired,
  showSettings: PropTypes.func.isRequired,
  profileId: PropTypes.string.isRequired,
  showLeaderboard: PropTypes.func.isRequired,
  inviteFriends: PropTypes.func.isRequired,
  showAchievements: PropTypes.func.isRequired,
  showServices: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};
