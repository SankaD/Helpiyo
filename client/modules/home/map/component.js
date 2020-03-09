import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { Answers } from 'react-native-fabric';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Toast from '../../utils/toast';
import styles from './styles';
import Logger from '../../utils/logger';
import ActionButton from '../../common/action_button/action_button.container';
import ProfileHandler from '../../common/data_handlers/profile_handler';
import firebase from 'react-native-firebase';

class MapPageComponent extends Component {
  static navigationOptions = {
    tabBarIcon: ({
      tintColor,
    }) => (
      <Icon
        name="map-marker-multiple"
        size={24}
        color={tintColor}
      />
    ),
    tabBarLabel: ({ focused, tintColor }) => (focused ? <Text style={{ color: tintColor, fontSize: 10 }}>Map</Text> : null),
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
    };
    // this._watchId = null;
    this.timer = null;
    this.loadRequestsDefault = this.loadRequestsDefault.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
    this.clearTimers = this.clearTimers.bind(this);
    this.setupTimers = this.setupTimers.bind(this);
  }

  loadRequestsDefault() {
    if (this.props.isFocused) {
      this.loadRequests(this.state.latitude, this.state.longitude, 100000);
    }
  }

  componentDidMount() {
    this.getCurrentLocation();
    Answers.logCustom('load-page', { name: 'map-page' });
    this.setupTimers();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.timer2);
  }

  componentDidUpdate() {
    if (this.props.shouldReloadData) {
      this.getCurrentLocation();
    }
    if (this.props.isFocused) {
      this.setupTimers();
    } else {
      this.clearTimers();
    }
  }

  clearTimers() {
    clearInterval(this.timer);
    clearInterval(this.timer2);
    this.timer = null;
    this.timer2 = null;
  }

  setupTimers() {
    if (!this.timer) {
      this.timer = setInterval(() => {
        Logger.info('timer : requests near by');
        this.loadRequestsDefault();
      }, 60 * 1000);
    }
    if (!this.timer2) {
      this.timer2 = setInterval(() => {
        Logger.info('timer : requests near by with updated location');
        this.getCurrentLocation();
      }, 120 * 1000);
    }
  }

  getCurrentLocation() {
    Logger.info('getting current location');
    if (!this.props.isFocused) {
      return;
    }
    const setState = this.setState.bind(this);
    navigator.geolocation.getCurrentPosition((location) => {
      Logger.info('location found');
      setState({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
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
      this.loadRequests(this.state.latitude, this.state.longitude, 100000);
    }, (error) => {
      Logger.info("couldn't get current location");
      Logger.error(error);
      Toast.error("Couldn't retrieve current location");
    }, { timeout: 10000 });
  }

  loadRequests(latitude, longitude, radius) {
    this.props.getNearByRequests(latitude, longitude, radius);
  }

  renderRequest(request) {
    let color;
    if (request.sos) {
      color = '#ee2b21';
    } else if (request.createdBy === this.props.currentProfileId) {
      color = '#333';
    } else {
      color = '#29995d';
    }
    Logger.info('rendering request pin');
    return (
      <MapView.Marker
        key={request._id}
        title={request.post}
        draggable={
          false
        }
        pinColor={color}
        coordinate={
          {
            latitude: request.location.coordinates[1],
            longitude: request.location.coordinates[0],
          }
        }
        onCalloutPress={() => this.props.showRequest(request._id)}
      />
    );
  }

  renderRequests() {
    const { requests } = this.props;
    Logger.info(`rendering request : ${requests.length}`);
    return requests.map(request => this.renderRequest(request));
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapView}
          showsUserLocation={this.props.isFocused}
          // showsMyLocationButton
          provider={PROVIDER_GOOGLE}
          showsCompass
          showsScale
          loadingEnabled
          initialRegion={{
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0122,
          }}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0122,
          }}
        >
          {this.renderRequests()}
        </MapView>
        <ActionButton navigation={this.props.navigation} />

      </View>
    );
  }
}

MapPageComponent.propTypes = {
  requests: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  getNearByRequests: PropTypes.func.isRequired,
  showRequest: PropTypes.func.isRequired,
  shouldReloadData: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool.isRequired,
  currentProfileId: PropTypes.string.isRequired,
};

MapPageComponent.defaultProps = {
};

export default withNavigationFocus(MapPageComponent);
