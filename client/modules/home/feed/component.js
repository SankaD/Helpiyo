import React, { Component } from 'react';
import {
  View,
  FlatList,
  Text,
} from 'react-native';
import firebase from 'react-native-firebase';
import { Answers } from 'react-native-fabric';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import EmptyView from '../../common/empty_view/component';
import Toast from '../../utils/toast';
import RequestView from '../../requests/request_view/container';
import ServiceView from '../../services/view/container';
import AdvertView from '../../common/advert/component';
import Logger from '../../utils/logger';
import ActionButton from '../../common/action_button/action_button.container';
import ProfileHandler from '../../common/data_handlers/profile_handler';

export default class FeedPageComponent extends Component {
    static navigationOptions = {
      tabBarIcon: ({ tintColor }) => (<Icon name="home-outline" size={24} color={tintColor} />),
      tabBarLabel: ({ focused, tintColor }) => (focused ? <Text style={{ color: tintColor, fontSize: 10 }}>Feed</Text> : null),
      header: null,
    };

    constructor(props) {
      super(props);
      this.state = {
        currentType: null,
      };
      this.refreshFeed = this.refreshFeed.bind(this);
    }

    checkLocationEnabled() {
      return true;
    }

    componentDidMount() {
      Logger.info('getting current location');
      this.checkLocationEnabled();
      navigator.geolocation.getCurrentPosition((location) => {
        Logger.info('location found');
        Logger.info(location);
        firebase.messaging().getToken()
          .then((token) => {
            if (token) {
              ProfileHandler.registerToken(token)
                .catch(() => {
                  Answers.logCustom('token-registration-failed');
                  Logger.error("Couldn't register FCM token");
                })
                .then(() => ProfileHandler.updateLocation(token, location.coords.latitude, location.coords.longitude));
            }
          });
        this.props.loadFeed(location.coords.latitude, location.coords.longitude);
      }, (error) => {
        Logger.error(error);
        Toast.error("Couldn't access location");
      }, { timeout: 30000 });
      Answers.logCustom('load-page', { name: 'feed-page' });
    }

    componentDidUpdate() {
      if (this.props.shouldReloadFeed) {
        Logger.info('getting current location : reloading feed');
        this.checkLocationEnabled();
        navigator.geolocation.getCurrentPosition((location) => {
          Logger.info('location found');
          Logger.info(location);
          firebase.messaging().getToken()
            .then((token) => {
              if (token) {
                ProfileHandler.registerToken(token)
                  .catch(() => {
                    Answers.logCustom('token-registration-failed');
                    Logger.error("Couldn't register FCM token");
                  })
                  .then(() => ProfileHandler.updateLocation(token, location.coords.latitude, location.coords.longitude));
              }
            });
          this.props.loadFeed(location.coords.latitude, location.coords.longitude);
        }, (error) => {
          Logger.error(error);
          Toast.error("Couldn't access location");
        }, { timeout: 30000 });
      }
    }

    refreshFeed() {
      Logger.info('refreshing feed');
      this.props.reloadFeed();
    }

    static renderRequest(request) {
      return (
        <RequestView request={request} />
      );
    }

    static renderService(service) {
      return (
        <ServiceView service={service} />
      );
    }

    static renderAdvert() {
      return (
        <AdvertView />
      );
    }

    showReporter() {
      this.props.showReportView(this.state.currentId, this.state.currentType);
      this.setState({ currentId: null, currentType: null });
    }

    static renderElement(item) {
      if (item.item.type === 'request') {
        return FeedPageComponent.renderRequest(item.item);
      }
      if (item.item.type === 'service') {
        return FeedPageComponent.renderService(item.item);
      }
      if (item.item.type === 'advert') {
        return FeedPageComponent.renderAdvert();
      }
      return <View />;
    }

    renderEmptyView() {
      return (
        <EmptyView
          label1="Your feed is empty."
          label2="Better connect with more people and try again"
          onPress={() => this.props.navigation.navigate('Feed')}
        />
      );
    }

    static renderFooter() {
      return (
        <View style={styles.listFooter} />
      );
    }

    render() {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.props.feed}
            renderItem={item => FeedPageComponent.renderElement(item)}
            refreshing={this.props.refreshing}
            keyExtractor={(item, index) => item._id}
            onRefresh={this.refreshFeed}
            contentContainerStyle={[{ flexGrow: 1 }, this.props.feed.length ? null : { justifyContent: 'center' }]}
            style={styles.list}
            ListEmptyComponent={this.renderEmptyView()}
            ListFooterComponent={FeedPageComponent.renderFooter()}
          />
          <ActionButton navigation={this.props.navigation} />

        </View>
      );
    }
}

FeedPageComponent.propTypes = {
  feed: PropTypes.array.isRequired,
  loadFeed: PropTypes.func.isRequired,
  shouldReloadFeed: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  showReportView: PropTypes.func.isRequired,
  reloadFeed: PropTypes.func.isRequired,
};
