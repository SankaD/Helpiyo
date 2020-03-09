import { NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import * as types from './types';
import Logger from '../../utils/logger';


export function goToSignIn() {
  Logger.info('Loading sign in page');
  return (dispatch) => {
    dispatch(NavigationActions.back());
  };
}

export function resetPassword(email) {
  Logger.info('resetting password');
  return (dispatch) => {
    dispatch({ type: types.RESET_PASSWORD });

    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        dispatch(goToSignIn());
      });
  };
}
