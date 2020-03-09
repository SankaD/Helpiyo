import React, { Component } from 'react';
import {
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { createBottomTabNavigator, SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import { Answers } from 'react-native-fabric';
import Logger from '../../utils/logger';

import FeedPage from '../feed/container';
import MapPage from '../map/container';
import RequestsPage from '../requests/container';
import ResponsesPage from '../responses/container';
import MorePage from '../more/container';

import TitleBar from '../../common/title_bar/title_bar.container';

import styles from './styles';
import commonStyles from '../../common/styles';

const HomePage = createBottomTabNavigator({
  Feed: {
    screen: FeedPage,
  },
  Map: {
    screen: MapPage,
  },
  Requests: {
    screen: RequestsPage,
  },
  Responses: {
    screen: ResponsesPage,
  },
  More: {
    screen: MorePage,
  },
}, {
  tabBarOptions: {
    showIcon: true,
    showLabel: false,
    upperCaseLabel: false,
    style: {
      backgroundColor: commonStyles.colors.color_1,
    },
  },
  backBehavior: 'none',
});

export default class HomePageComponent extends Component {
  componentDidMount() {
    Answers.logCustom('load-page', { name: 'home-page' });
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'App asks for permission',
          message: 'App needs location permission for generating news feed',
        },
      )
        .then((result) => {
          Logger.info('permission granted');
          Logger.info(result);
          this.props.reloadFeed();
        })
        .catch((error) => {
          Logger.error(error);
        });
    }
    this.props.subscribeToBranch();
  }
  render() {
    return (
      <SafeAreaView style={styles.container} forceInset={{ bottom: 'never' }}>
        <TitleBar navigation={this.props.navigation} />
        <HomePage />
      </SafeAreaView>
    );
  }
}

HomePageComponent.propTypes = {
  reloadFeed: PropTypes.func.isRequired,
  subscribeToBranch: PropTypes.func.isRequired,
};

HomePageComponent.defaultProps = {
  // tutorialWanted: false,
};
