import { NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import { Answers } from 'react-native-fabric';
import { networkGet, networkPost } from '../utils/url_helper';
import Toast from '../utils/toast';

import * as types from './types';
import Logger from '../utils/logger';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import * as globalActions from '../global/actions';
import ProfileHandler from '../common/data_handlers/profile_handler';

export function gotoGeneralSettings() {
  Logger.info('loading general settings');
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'GeneralSettings', key: 'GeneralSettings' }));
  };
}

export function gotoAccountSettings() {
  Logger.info('loading account settings');
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'AccountSettings', key: 'AccountSettings' }));
  };
}

export function gotoPrivacySettings() {
  Logger.info('loading privacy settings');
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'PrivacySettings', key: 'PrivacySettings' }));
  };
}

export function gotoAboutSettings() {
  Logger.info('loading about settings');
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'AboutSetting', key: 'AboutSettings' }));
  };
}

export function changePassword(currentPassword, newPassword, confirmation) {
  Logger.info('changing password');
  return (dispatch) => {
    dispatch({ type: types.CHANGE_PASSWORD });
    let hasError = false;
    if (!currentPassword || currentPassword === '') {
      dispatch({ type: types.CHANGE_PASSWORD_FAILED, currentPassword: 'Current password is required' });
      hasError = true;
    }
    if (!newPassword || newPassword === '') {
      dispatch({ type: types.CHANGE_PASSWORD_FAILED, newPassword: 'New password is required' });
      hasError = true;
    }
    if (newPassword !== confirmation) {
      dispatch({ type: types.CHANGE_PASSWORD_FAILED, confirmation: "Password and confirmation doesn't match" });
      hasError = true;
    }
    if (hasError) {
      return Promise.resolve();
    }
    const user = firebase.auth().currentUser;
    Logger.debug(user.email);
    // Logger.info(currentPassword);
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateAndRetrieveDataWithCredential(credentials)
      .catch((error) => {
        Logger.error('re-authentication failed');
        throw error;
      })
      .then(() => user.updatePassword(newPassword))
      .then(() => {
        dispatch({ type: types.PASSWORD_CHANGED });
      })
      .catch((error) => {
        Logger.error('update password failed');
        Logger.error(error);
        Logger.error(error.code);
        let currentPasswordError = '';
        let newPasswordError = '';
        if (error.code === 'auth/user-not-found') {
          currentPasswordError = 'User not found';
        } else if (error.code === 'auth/invalid-credentials' || error.code === 'auth/wrong-password') {
          currentPasswordError = 'Wrong password';
        } else if (error.code === 'auth/weak-password') {
          newPasswordError = 'Password is too weak';
        } else {
          currentPasswordError = 'Unknown error occurred';
        }
        dispatch({
          type: types.CHANGE_PASSWORD_FAILED,
          currentPassword: currentPasswordError,
          newPassword: newPasswordError,
        });
      });
  };
}

export function submitFeedback(feedback) {
  Logger.info('submitting feedback');
  Answers.logCustom('feedback-submit');
  return (dispatch) => {
    dispatch({ type: types.SUBMIT_FEEDBACK });
    if (feedback === '') {
      dispatch({ type: types.SUBMIT_FEEDBACK_FAILED, feedbackError: 'Feedback is required' });
      return;
    }
    networkPost('common/new-feedback', JSON.stringify({ feedback }))
      .then(() => {
        dispatch({ type: types.FEEDBACK_SUBMITTED });
        Toast.success('Feedback submitted successfully');
        Answers.logCustom('feedback-submitted');
      })
      .catch((error) => {
        Answers.logCustom('feedback-submit-failed');
        Logger.error('submitting feedback failed');
        Logger.error(error);
        Toast.error('Feedback submission failed');
        dispatch({ type: types.SUBMIT_FEEDBACK_FAILED, feedbackError: 'Internal server error' });
      });
  };
}

export function requestPhoneNumberCode(currentPassword, phoneNumber) {
  Logger.info('requesting phone number code');
  return (dispatch) => {
    dispatch({ type: types.REQUEST_PHONE_CODE });

    if (!currentPassword || currentPassword === '') {
      dispatch({ type: types.REQUEST_PHONE_CODE_FAILED, currentPasswordError: 'Current password is required' });
      return;
    }
    const user = firebase.auth().currentUser;
    Logger.debug(user.email);
    // Logger.info(currentPassword);
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    user.reauthenticateAndRetrieveDataWithCredential(credentials)
      .catch((error) => {
        Logger.error('authentication failed');
        throw error;
      })
      .then(() => networkPost('profiles/change-phone-number', JSON.stringify({ phoneNumber })))
      .then(() => {
        Logger.info('phone code requested');
        dispatch({ type: types.PHONE_CODE_REQUESTED });
      })
      .catch((error) => {
        Logger.error(error);
        let currentPasswordError = '';
        if (error.code === 'auth/user-not-found') {
          currentPasswordError = 'User not found';
        } else if (error.code === 'auth/invalid-credentials' || error.code === 'auth/wrong-password') {
          currentPasswordError = 'Wrong password';
        }
        Toast.error('Requesting phone number failed');
        dispatch({ type: types.REQUEST_PHONE_CODE_FAILED, currentPasswordError });
      });
  };
}

export function verifyPhoneNumber(phoneNumber, code) {
  Logger.info('changing phone number');
  return (dispatch) => {
    dispatch({ type: types.CHANGE_PHONE_NUMBER });
    if (phoneNumber === '') {
      dispatch({ type: types.CHANGE_PHONE_NUMBER_FAILED, phoneNumberError: 'Phone number is required' });
      return;
    }
    if (code === '') {
      dispatch({ type: types.CHANGE_PHONE_NUMBER_FAILED, phoneCodeError: 'Verification code is required' });
      return;
    }
    networkPost('profiles/verify-phone-number', JSON.stringify({ phoneNumber, code }))
      .then(() => {
        Logger.info('phone number changed');
        dispatch({ type: types.PHONE_NUMBER_CHANGED });
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error('Verifying phone number failed');
        dispatch({ type: types.CHANGE_PHONE_NUMBER_FAILED });
      });
  };
}

export function showPasswordModal(visible) {
  return (dispatch) => {
    dispatch({ type: types.SHOW_PASSWORD_MODAL, visible });
  };
}

export function showFeedbackModal(visible) {
  return (dispatch) => {
    dispatch({ type: types.SHOW_FEEDBACK_MODAL, visible });
  };
}

export function showPhoneModal(visible) {
  return (dispatch) => {
    dispatch({ type: types.SHOW_PHONE_MODAL, visible });
  };
}

export function linkWithFacebook() {
  Logger.info('linking with facebook');
  return (dispatch) => {
    LoginManager.logInWithReadPermissions(['email', 'public_profile'])
      .then((result) => {
        if (result.isCancelled) {
          Toast.error('Sign in to facebook cancelled');
        } else {
          AccessToken.getCurrentAccessToken()
            .then((data) => {
              const credentials = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
              return firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credentials)
                .then(() => {
                  Logger.info('linked to facebook');
                  Toast.success("You've successfully linked facebook account");
                  Answers.logCustom('link-facebook');
                })
                .catch((error) => {
                  Logger.error('linkWithCredential failed');
                  Logger.error(error);
                  if (error.code === 'auth/provider-already-linked' || error.message === 'User has already been linked to the given provider.') {
                    Toast.error('Account is already linked to facebook');
                  } else if (error.code === 'auth/invalid-credential') {
                    Toast.error('Invalid credentials. Please try again');
                  } else if (error.code === 'auth/credential-already-in-use') {
                    Toast.error('Credentials are already in use');
                  } else {
                    Logger.error(error.code);
                    Toast.error('Linking failed due to some reason');
                  }
                });
            })
            .catch((error) => {
              Logger.error(error);
              Toast.error('Linking failed due to some reason');
              // Toasts.error('Sign in failed');
            });
        }
      })
      .catch((error) => {
        Logger.error('logInWithReadPermissions failed while linking facebook');
        Logger.error(error);
        Toast.error('Linking failed');
      });
  };
}
export function loadInterestSetter() {
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'InterestSetter', key: 'InterestSetter' }));
  };
}
export function loadInterests() {
  Logger.info('loading interests');
  return (dispatch) => {
    dispatch({ type: types.LOAD_INTERESTS });
    networkGet('profiles/get-interests')
      .then(result => result.interests)
      .then((interests) => {
        dispatch({ type: types.INTERESTS_LOADED, interests });
      })
      .catch((error) => {
        Toast.error('Loading interests failed');
        Logger.error(error);
        dispatch({ type: types.LOAD_INTERESTS_FAILED });
      });
  };
}
export function setInterests(interests) {
  Logger.info('setting interests');
  return (dispatch) => {
    dispatch({ type: types.SET_INTERESTS });
    networkPost('profiles/set-interests', JSON.stringify({ interests }))
      .then((result) => {
        dispatch({ type: types.INTERESTS_SET });
      })
      .catch((error) => {
        Toast.error('Setting interests failed');
        Logger.error(error);
        dispatch({ type: types.SET_INTERESTS_FAILED });
      });
  };
}
