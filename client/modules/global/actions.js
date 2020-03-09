import { NavigationActions, StackActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import Branch from 'react-native-branch';
import Toast from '../utils/toast';
import * as globalTypes from './types';
import {
  networkGet,
  networkPost,
} from '../utils/url_helper';
import Logger from '../utils/logger';
import * as types2 from '../auth/verify_page/types';

export function setGlobalError(error) {
  Logger.info('setting global error');
  Logger.error(error);
  return (dispatch) => {
    dispatch({
      type: globalTypes.ERROR,
      error,
    });
  };
}


export function refreshProfile() {
  Logger.info('refreshing profile');
  return (dispatch, getState) => {
    if (!firebase.auth().currentUser) {
      Logger.info('current user not found');
      dispatch(StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({
          routeName: 'LoadupPage',
          key: 'LoadupPage',
        })],
      }));
      return;
    }

    networkGet('profiles/my')
      .then(({ profile }) => {
        Logger.info(profile);
        if (!profile) {
          Logger.info('my profile not received. need to create one');
          dispatch({
            type: types2.LOAD_PROFILE_CREATOR,
            email: firebase.auth().currentUser.email,
            id: firebase.auth().currentUser.uid,
          });
          dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
              routeName: 'VerifyPage',
              key: 'VerifyPage',
            })],
          }));
          return;
        }
        dispatch({
          type: globalTypes.SET_PROFILE,
          profile,
        });

        Branch.setIdentity(profile._id);
        if (getState().modules.global.launchedFromLink) {
          dispatch({ type: globalTypes.CONSUME_LAUNCHED_FROM_LINK });
          return;
        }

        if (profile.status === 'active') {
          dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
              routeName: 'HomePage',
              key: 'HomePage',
            })],
          }));
        } else {
          dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
              routeName: 'SignInPage',
              key: 'SignInPage',
            })],
          }));
        }
      })
      .catch((error) => {
        Logger.error(error);
        // dispatch({ type: 'RESET_STATE' });
        // dispatch({ type: globalTypes.SIGN_OUT });
        dispatch(StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({
            routeName: 'SignInPage',
            key: 'SignInPage',
          })],
        }));
        if (firebase.auth().currentUser) {
          Toast.error("Couldn't sign in user. Please try again later.");
        }
      });
  };
}

export function updateToken(token) {
  Logger.info('updating token');
  return (dispatch) => {
    dispatch({
      type: globalTypes.UPDATE_FCM_TOKEN,
    });
    networkPost('profile/update-token', {
      token,
    })
      .then((result) => {
        Logger.info('token updated');
        dispatch({
          type: globalTypes.FCM_TOKEN_UPDATED,
        });
      })
      .catch((error) => {
        Logger.info('updating token failed');
        Logger.error(error);
        dispatch({
          type: globalTypes.UPDATE_FCM_TOKEN_FAILED,
          error,
        });
      });
  };
}
export function finishTutorial() {
  return (dispatch) => {
    dispatch({ type: globalTypes.TUTORIAL_OVER });
  };
}
// export function signOut() {
//   Logger.info('Signing out');
//   return (dispatch) => {
//     Answers.logCustom('sign-out');
//     dispatch({ type: globalTypes.SIGN_OUT });
//     AsyncStorage.clear();
//     firebase.auth().signOut();
//     dispatch({ type: 'RESET_STATE' });
//
//     // dispatch(globalActions.setToken(null));
//   };
// }
