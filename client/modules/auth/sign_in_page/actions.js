import { NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import validator from 'validator';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { Answers } from 'react-native-fabric';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

import * as types from './types';
import * as globalActions from '../../global/actions';
import ProfileHandler from '../../common/data_handlers/profile_handler';
import Logger from '../../utils/logger';
import Toasts from '../../utils/toast';


export function goToSignUp() {
  Logger.info('Loading signup page');
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'SignUpPage', key: 'SignUpPage' }));
  };
}

export function goToForgotPassword() {
  Logger.info('loading forgot password page');
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'PasswordReset', key: 'PasswordReset' }));
  };
}

export function signIn(email) {
  Logger.info('signing in...');
  return (dispatch) => {
    dispatch({ type: types.SIGN_IN });

    let hasError = false;
    let emailError = '';

    if (!email || email === '') {
      emailError = 'Please provide your email';
      hasError = true;
    } else if (!validator.isEmail(email)) {
      emailError = 'Please check email format';
      hasError = true;
    }
    if (hasError) {
      dispatch({
        type: types.SIGN_IN_FAILED,
        emailError,
      });
      return;
    }
    const settings = {
      url: 'https://helpiyo.me/login',
      handleCodeInApp: true,
      android: {
        packageName: 'me.helpiyo.app',
        installApp: true,
        minimumVersion: '19',
      },
      iOS: {
        bundleId: 'me.helpiyo.ios',
      },
    };
    firebase.auth().sendSignInLinkToEmail(email, settings)
      .then(() => {
        Logger.info('sign in email sent');
        const unsubscribe = firebase.links().onLink((url) => {
          if (firebase.auth().isSignInWithEmailLink(url)) {
            Logger.info('url is a sign in url');
            firebase.auth().signInWithEmailLink(email, url)
              .then(() => {
                Logger.info('signed in');
                Toasts.success("You've signed in successfully");
                Answers.logLogin('email', true);
                dispatch({ type: types.SIGNED_IN });
                dispatch(globalActions.refreshProfile());
                unsubscribe();
                return firebase.messaging().getToken();
              })
              .then(token => ProfileHandler.registerToken(token)
                .catch((error) => {
                  Logger.error(error);
                  Answers.logCustom('token-registration-failed');
                  Logger.error("Couldn't register FCM token");
                }))
              .catch((error) => {
                Logger.info("couldn't sign in");
                Logger.error(error);
                Answers.logLogin('email', false);
                let miscError = '';
                switch (error.code) {
                  case 'auth/invalid-email':
                    emailError = 'Please check email format';
                    break;
                  case 'auth/user-disabled':
                    miscError = 'User is disabled';
                    break;
                  case 'auth/user-not-found':
                    miscError = 'Username or password is incorrect';
                    break;
                  case 'auth/wrong-password':
                    miscError = 'Username or password is incorrect';
                    break;
                  default:
                    miscError = 'Oops, something went wrong !';
                    break;
                }
                dispatch({
                  type: types.SIGN_IN_FAILED,
                  miscError,
                  emailError,
                });
              });
          }
        });
      });
  };
}

export function signInWithGoogle() {
  Logger.info('signInWithGoogle');
  return (dispatch) => {
    GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      .catch((error) => {
        Logger.error(error);
        Toasts.error("Couldn't check play services");
        throw error;
      })
      .then(() => GoogleSignin.configure({
        webClientId: 'xxxx.apps.googleusercontent.com',
        // offlineAccess: true,
      }))
      .then(() => GoogleSignin.signIn()
        .catch((error) => {
          Logger.error(error);
          Logger.error(error.code);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
            //   Toasts.error('Sign in cancelled by user');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (f.e. sign in) is in progress already
            Toasts.error('Different sign in is already in progress');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
            Toasts.error('Play services are not available');
          } else {
            // some other error happened
            Toasts.error(error.code);
          }
          throw error;
        }))
      .then((userInfo) => {
        Logger.info('signed in to google account');
        const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken);// , userInfo.accessToken);
        return firebase.auth().signInWithCredential(credential)
          .catch((error) => {
            Logger.error(error);
            Toasts.error('Sign in failed');
            throw error;
          });
      })
      .then(() => {
        Logger.info('signed in');
        Toasts.success("You've signed in successfully");
        Answers.logLogin('google', true);
        dispatch({ type: types.SIGNED_IN });
        dispatch(globalActions.refreshProfile());
        return firebase.messaging().getToken();
      })
      .then(token => ProfileHandler.registerToken(token)
        .catch((error) => {
          Logger.error(error);
          Answers.logCustom('token-registration-failed');
          Logger.error("Couldn't register FCM token");
        }))
      .catch((error) => {
        Logger.error(error);
        // Toasts.error('Sign in failed');
      });
  };
}

export function signInWithFacebook() {
  Logger.info('signInWithFacebook');
  return dispatch =>
    // LoginManager.logOut();
    LoginManager.logInWithReadPermissions(['email', 'public_profile'])
      .then((result) => {
        Logger.info(result);
        if (result.isCancelled) {
          Toasts.error('Sign in cancelled.');
          Answers.logLogin('facebook', false);
          return Promise.resolve();
        }
        Logger.info('getting current access token');
        return AccessToken.getCurrentAccessToken()
          .then((data) => {
            Logger.info('signing in with credentials');
            const credentials = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
            Logger.debug(credentials);
            return firebase.auth().signInWithCredential(credentials);
          })
          .then((result) => {
            Logger.info('signed in');
            Logger.debug(result);
            if (firebase.auth().currentUser && !firebase.auth().currentUser.emailVerified) {
              Toasts.success('Please verify your email address and sign in again.');
              // return firebase.auth().signOut();
              return Promise.resolve();
            }
            Toasts.success("You've signed in successfully");
            Answers.logLogin('facebook', true);
            dispatch({ type: types.SIGNED_IN });
            dispatch(globalActions.refreshProfile());
            return firebase.messaging().getToken()
              .then(token => ProfileHandler.registerToken(token)
                .catch((error) => {
                  Logger.error('ProfileHandler.registerToken failed');
                  Logger.error(error);
                  Answers.logCustom('token-registration-failed');
                  Answers.logLogin('facebook', false);
                  Logger.error("Couldn't register FCM token");
                }));
          });
      })
      .catch((error) => {
        let miscError = '';
        switch (error.code) {
          case 'auth/account-exists-with-different-credential':
            miscError = 'Email is already in use. Sign In using original provider and link to facebook later.';
            break;
          case 'auth/user-disabled':
            miscError = 'User is disabled';
            break;
          default:
            miscError = 'Oops, something went wrong ! Sign in failed';
            break;
        }

        Logger.error('logInWithReadPermissions failed');
        Logger.error(error);
        Answers.logLogin('facebook', false);
        Toasts.error(miscError);
      });
}
