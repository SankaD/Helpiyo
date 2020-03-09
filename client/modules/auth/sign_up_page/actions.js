import validator from 'validator';
import { NavigationActions } from 'react-navigation';
import * as types from './types';
import { getFullUrl } from '../../utils/url_helper';
import * as signInActions from '../sign_in_page/actions';
import Toast from '../../utils/toast';
import { Answers } from 'react-native-fabric';
import Logger from '../../utils/logger';

export function signUp(email, heroName) {
  Logger.info('Signing up');
  return (dispatch) => {
    dispatch({
      type: types.SIGN_UP,
    });

    let hasErrors = false;
    const errors = {};
    if (!email || email === '') {
      Logger.info('email is required');
      hasErrors = true;
      Answers.logSignUp('basic', false, { error: 'password-required' });
      errors.emailError = 'Please provide your email';
    } else if (validator.isEmail(email) !== true) {
      Logger.info(`not a valid email : ${email}`);
      hasErrors = true;
      Answers.logSignUp('basic', false, { error: 'email-validation' });
      errors.emailError = 'Please check email format';
    }

    if (!heroName || heroName === '') {
      Logger.info('hero name is required');
      hasErrors = true;
      Answers.logSignUp('basic', false, { error: 'hero-name-required' });
      errors.heroNameError = 'Please provide a hero name';
    } else if (validator.isAlphanumeric(heroName) !== true) {
      Logger.info(`Not a valid hero name : ${heroName}`);
      hasErrors = true;
      Answers.logSignUp('basic', false, { error: 'hero-name-validation' });
      errors.heroNameError = 'Please provide only numbers and letters';
    }
    if (hasErrors === true) {
      dispatch({ type: types.SIGN_UP_FAILED, ...errors });
      return;
    }

    const url = getFullUrl('profiles/create');
    Logger.info('creating profile in the server');
    Logger.info(url);

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        heroName,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        Logger.info('signup response received from server');
        Logger.info(response);
        if (response.status === 200) {
          Toast.show('User created successfully', Toast.durations.SHORT, Toast.colors.GREEN);
          Answers.logSignUp('basic', true);
          dispatch({ type: types.SIGNED_UP });
          dispatch(signInActions.signIn(email));
        } else {
          throw response;
        }
      })
      .catch((error) => {
        Logger.info('sign up failed');
        Logger.error(error);
        Answers.logSignUp('basic', false, { error });

        if (error === 'validation-error') {
          errors.miscError = 'Validation failed';
        } else if (error === 'email-in-use') {
          errors.emailError = 'Email is already in use';
        } else if (error === 'hero-name-exists') {
          errors.heroNameError = 'Hero name is already in use. Please provide another name';
        } else {
          errors.miscError = 'Something went wrong';
        }
        Toast.error('User creation failed');
        dispatch({ type: types.SIGN_UP_FAILED, ...errors });
      });
  };
}

export function goToSignIn() {
  Logger.info('Loading sign in page');
  return (dispatch) => {
    dispatch(NavigationActions.back());
  };
}
