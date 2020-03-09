import React, { Component } from 'react';
import {
  TextInput, View, Text, TouchableOpacity, ScrollView, Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import styles from './title_bar.styles';
import Logger from '../../utils/logger';

export default class TitleBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTimeout: null,
      searchString: this.props.searchString,
    };
  }

  componentDidMount() {
    this.props.loadMessageCount();
    this.props.loadNotificationCount();
  }

  componentWillUnmount() {
    clearTimeout(this.state.searchTimeout);
  }

  static renderNotificationCount(count) {
    if (count > 0) {
      return (<Text style={styles.notificationCount}>{count}</Text>);
    }
    return null;
  }

  render() {
    return (
      <View style={styles.frame}>
        <View style={styles.container}>
          {/* <Image source={require('../../../images/Icon_blue_512.png')} style={styles.logo} /> */}
          {/* <Text style={styles.titleText} /> */}
          <TouchableOpacity style={styles.searchIconButton} onPress={() => this.props.loadSearch()}>
            <View style={styles.searchBarContainer} pointerEvents="none">
              <Icon name="magnify" size={24} style={styles.icon} />
              <TextInput
                style={styles.searchBarInput}
                underlineColorAndroid="transparent"
                editable={false}
                onFocus={() => this.props.loadSearch()}
                placeholder=" Search here..."
                placeholderTextColor="#AAA"
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => this.props.openMessages()}
          >
            <View style={styles.notificationComposite}>
              <Icon
                name="forum-outline"
                size={this.props.messageCount ? 24 : 24}
                style={this.props.messageCount ? styles.activeIcon : styles.icon}
              />
              {TitleBar.renderNotificationCount(this.props.messageCount)}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => this.props.openNotifications(0)}
          >
            <View style={styles.notificationComposite}>
              <Icon
                name="bell-outline"
                size={this.props.notificationCount ? 24 : 24}
                style={this.props.notificationCount ? styles.activeIcon : styles.icon}
              />
              {TitleBar.renderNotificationCount(this.props.notificationCount)}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

TitleBar.propTypes = {
  navigation: PropTypes.object.isRequired,
  searchResults: PropTypes.object.isRequired,
  searchInProgress: PropTypes.bool.isRequired,
  lastSearchedOn: PropTypes.number.isRequired,
  // search: PropTypes.func.isRequired,
  discardSearchResults: PropTypes.func.isRequired,
  searchString: PropTypes.string,
  showProfile: PropTypes.func.isRequired,
  showRequest: PropTypes.func.isRequired,
  notificationCount: PropTypes.number.isRequired,
  messageCount: PropTypes.number.isRequired,
  openNotifications: PropTypes.func.isRequired,
  openMessages: PropTypes.func.isRequired,
  loadNotificationCount: PropTypes.func.isRequired,
  loadMessageCount: PropTypes.func.isRequired,
  loadSearch: PropTypes.func.isRequired,
};

TitleBar.defaultProps = {
  searchString: '',
};
