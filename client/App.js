/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { View, StatusBar, BackHandler, Platform } from 'react-native';
import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
import {
  connect,
  Provider,
} from 'react-redux';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import thunk from 'redux-thunk';
import firebase from 'react-native-firebase';
import reduxLogger from 'redux-logger';
import GeoCoding from 'react-native-geocoding';
import { NavigationActions, StackActions } from 'react-navigation';
import { Answers } from 'react-native-fabric';
import branch from 'react-native-branch';
import { reduxifyNavigator, createReactNavigationReduxMiddleware, createNavigationReducer } from 'react-navigation-redux-helpers';
import { createDeepLinkingHandler } from 'react-native-deep-link';
import reducers from './modules/reducers';
import MainStack from './modules/main_stack.component';
import DataStore from './modules/common/data_stores';
import commonStyles from './modules/common/styles';
import NotificationHandler from './modules/common/title_bar/notification_handler';
import * as actions from './modules/global/actions';
import * as globalTypes from './modules/global/types';
import ProfileHandler from './modules/common/data_handlers/profile_handler';
import Toast from './modules/utils/toast';
import Logger from './modules/utils/logger';
import { showRequest } from './modules/requests/actions';
import { showService } from './modules/services/actions';
import { networkPost } from './modules/utils/url_helper';

DataStore.init();
GeoCoding.init('');

const handlePasswordReset = ({ dispatch }) => ({ query: { mode, oobCode } }) => {
  console.log(`mode = ${mode}, code=${oobCode}`);
  dispatch(NavigationActions.navigate({
    routeName: 'ChangePassword',
    params: { mode, oobCode },
    key: 'ChangePassword',
  }));
};

branch.initSessionTtl = 10000;

const withDeepLinking = createDeepLinkingHandler([]);

const navReducer = createNavigationReducer(MainStack);

const reduxMiddleware = createReactNavigationReduxMiddleware('root', state => state.nav);
const App = reduxifyNavigator(MainStack, 'root');
const mapStateToProps = state => ({
  state: state.nav,
});
const middleware = __DEV__ ? applyMiddleware(thunk, reduxMiddleware, reduxLogger) : applyMiddleware(thunk, reduxMiddleware);

const reducer = combineReducers({
  nav: navReducer,
  modules: reducers,
});

class MainApp extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress.bind(this));
    const {
      dispatch,
      nav,
    } = this.props;
    dispatch(actions.refreshProfile());
    try {
      firebase.auth()
        .onAuthStateChanged((user) => {
          Logger.info('Auth state changed');
          if (user) {
            Logger.info('User is signed in');
            Logger.debug(user.toJSON());
            if (firebase.auth().currentUser && !firebase.auth().currentUser.emailVerified) {
              Toast.success('Please verify your email address and sign in again.');
              user.sendEmailVerification();
              return firebase.auth().signOut();
            }
            this.onTokenRefreshListener = firebase.messaging().onTokenRefresh((fcmToken) => {
              Logger.info('token refreshed');
              ProfileHandler.registerToken(fcmToken)
                .catch(() => {
                  Answers.logCustom('token-registration-failed');
                  Logger.error("Couldn't register FCM token");
                });
            });
            dispatch(actions.refreshProfile());
          } else {
            Logger.info('User is not signed in');
            this.onTokenRefreshListener = () => { };
            dispatch(StackActions.reset({
              index: 0, actions: [NavigationActions.navigate({ routeName: 'IntroPage', key: 'IntroPage' })],
            }));
            dispatch({ type: 'RESET_STATE' });
          }
        });

      firebase.messaging().hasPermission()
        .then((enabled) => {
          if (!enabled) {
            Logger.info('requesting firebase messaging permissions');
            return firebase.messaging().requestPermission()
              .catch((error) => {
                Logger.info(error);
                Toast.warn('Permission is required to provide notifications');
              });
          }
          return null;
        })
        .then(() => {
          firebase.messaging().onMessage((message) => {
            NotificationHandler.dispatch = this.props.dispatch;
            NotificationHandler.handleNotification(message);
          });
        });
      // firebase.admob().initialize('ca-app-pub-xxx'); // test account
      firebase.admob().initialize('ca-app-pub-xxx'); // real account
    } catch (e) {
      Logger.info(e);
    }

    // branch.subscribe(({ error, params }) => {
    //   if (error) {
    //     Logger.info('branch error : ');
    //     Logger.error(error);
    //   }
    //   Logger.info('link params');
    //   Logger.info(params);
    //   if (params.itemCategory === 'request' && !!params.requestId) {
    //     dispatch({ type: globalTypes.LAUNCHED_FROM_LINK });
    //     dispatch(showRequest(params.requestId));
    //     networkPost('common/add-points-for-share', JSON.stringify({
    //       elementType: 'request',
    //       elementId: params.requestId,
    //       profileId: params.referrer,
    //     }));
    //   } else if (params.itemCategory === 'service' && !!params.serviceId) {
    //     dispatch({ type: globalTypes.LAUNCHED_FROM_LINK });
    //     dispatch(showService(params.serviceId));
    //     networkPost('common/add-points-for-share', JSON.stringify({
    //       elementType: 'service',
    //       elementId: params.serviceId,
    //       profileId: params.referrer,
    //     }));
    //   }
    // });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress.bind(this));
    this.onTokenRefreshListener();
  }

  onBackPress() {
    Logger.info('back press');
    Logger.info(this.props);
    if (this.props.state.index === 0) {
      BackHandler.exitApp();
      return true;
    }
    this.props.dispatch(NavigationActions.back());
    return true;
  }

  render() {
    // const {
    //   navigation, dispatch, width, height,
    // } = this.props;
    // const screenProps = { width, height /* ... */ };
    return (
      <App
        {...this.props}
      />
    );
  }
}
const AppWithNav = connect(mapStateToProps)(withDeepLinking(MainApp));

export default class Root extends Component {
  constructor(props) {
    super(props);
    console.ignoredYellowBox = [
      'Setting a timer',
    ];

    this.store = createStore(reducer, middleware);
    global.store = this.store;
  }

  componentWillMount() {
    if (Platform.OS === 'Android') {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
        .then(() => {
          Logger.info('Location services are enabled');
        })
        .catch((error) => {
          Logger.error(error);
          Toast.error('Location services are needed for Helpiyo to work');
        });
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <View style={{ flex: 1, backgroundColor: commonStyles.colors.color_1 }}>
          <StatusBar backgroundColor={commonStyles.colors.color_1} barStyle="light-content" />
          <AppWithNav />
        </View>
      </Provider>
    );
  }
}
