import validator from 'validator';
import { NavigationActions } from 'react-navigation';
import { Answers } from 'react-native-fabric';
import Branch from 'react-native-branch';
import firebase from 'react-native-firebase';
import * as types from './types';
import * as globalActions from '../../global/actions';
import { networkGet, networkPost } from '../../utils/url_helper';
import Toast from '../../utils/toast';
import Logger from '../../utils/logger';


export function verify(emailCode, phoneCode) {
  Logger.info('Verifying...');
  return (dispatch, getState) => {
    dispatch({ type: types.VERIFY });

    let hasErrors = false;
    const errors = {};
    const pattern = /[\d]{6}/;
    let isValidCode = validator.matches(emailCode, pattern);
    if (isValidCode === false) {
      Logger.info(`Not a valid email code : ${emailCode}`);
      hasErrors = true;
      errors.emailCodeError = 'Not a valid email code';
    }
    isValidCode = validator.matches(phoneCode, pattern);
    if (isValidCode === false) {
      Logger.info(`Not a valid phone code : ${phoneCode}`);
      hasErrors = true;
      errors.phoneCodeError = 'Not a valid phone code';
    }
    if (hasErrors === true) {
      Toast.error('Profile verification failed');
      dispatch({ type: types.VERIFY_FAILED, ...errors });
      return;
    }
    const profile = getState().modules.global.profile;
    if (!profile) {
      Toast.error('User not logged in. Please sign in again...');
      dispatch({ type: types.VERIFY_FAILED, miscError: 'User not logged in. Please sign in again...' });
      return;
    }
    Logger.info(`verifying profile in the server : ${profile._id}`);
    networkGet(`profiles/verify/${emailCode}/${phoneCode}`)
      .then((response) => {
        if (response.code !== 200) {
          if (response.message === 'invalid-email-code') {
            dispatch({ type: types.VERIFY_FAILED, emailCodeError: 'Email verification code is invalid' });
          } else if (response.message === 'invalid-phone-code') {
            dispatch({ type: types.VERIFY_FAILED, phoneCodeError: 'Phone verification code is invalid' });
          } else {
            dispatch({ type: types.VERIFY_FAILED, miscError: response.message });
          }
          return;
        }
        dispatch(globalActions.refreshProfile());
      })
      .catch((error) => {
        Logger.error(error);
        dispatch({ type: types.VERIFY_FAILED, miscError: error });
      });
  };
}

export function createProfile(email, heroName, id) {
  Logger.info(`creating profile : ${heroName}`);
  return (dispatch) => {
    let hasErrors = false;
    const errors = {};
    heroName = heroName.trim();
    if (!heroName || heroName === '') {
      Logger.info('hero name is required');
      hasErrors = true;
      Answers.logSignUp('basic', false, { error: 'hero-name-required' });
      errors.heroNameError = 'Please provide a hero name';
    } else if (/^[a-zA-Z0-9][a-zA-Z .0-9]*[a-zA-Z0-9]$/.test(heroName) !== true) {
      Logger.info(`Not a valid hero name : ${heroName}`);
      hasErrors = true;
      Answers.logSignUp('basic', false, { error: 'hero-name-validation' });
      Toast.error('Hero name should only have numbers, letters, periods and spaces');
      errors.heroNameError = 'Please provide only numbers, letters, periods and spaces';
    }
    if (hasErrors === true) {
      dispatch({ type: types.CREATE_PROFILE_FAILED, ...errors });
      Answers.logSignUp('basic', false, { ...errors });
      return;
    }
    Branch.getFirstReferringParams()
      .catch((error) => {
        Logger.error(error);
        return null;
      })
      .then(params => networkPost('profiles/create', JSON.stringify({
        email,
        heroName,
        id,
        referrer: params.referrer,
        linkData: params,
      })))
      .then((response) => {
        if (response.code !== 200) {
          return;
        }
        Answers.logSignUp('basic', true);
        dispatch({ type: types.PROFILE_CREATED });
        // dispatch(NavigationActions.navigate({ routeName: 'IntroPage', key: 'IntroPage' }));
        dispatch(globalActions.refreshProfile());
      })
      .catch((error) => {
        Logger.error(error);
        if (error === 'hero-name-exists') {
          dispatch({ type: types.CREATE_PROFILE_FAILED, heroNameError: 'Hero name already exists' });
          Toast.error('Hero name already exists. Please provide another name');
        } else if (error === 'hero-name-invalid') {
          dispatch({ type: types.CREATE_PROFILE_FAILED, heroNameError: 'Hero name should only have numbers, letters and spaces' });
          Toast.error('Hero name should only have numbers, letters and spaces');
        } else {
          dispatch({ type: types.CREATE_PROFILE_FAILED, heroNameError: 'Something went wrong' });
          Toast.error('Something went wrong in the servers');
        }
        Answers.logSignUp('basic', false, { error });
      });
  };
}

export function gotoHome() {
  Logger.info('Loading home page');
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'HomePage', key: 'HomePage' }));
  };
}
