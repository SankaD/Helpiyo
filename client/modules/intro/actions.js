import { NavigationActions, StackActions } from 'react-navigation';
import Logger from '../utils/logger';
import * as globalActions from '../global/actions';
import { networkGet } from '../utils/url_helper';

export function gotoSignIn() {
  Logger.info('skipping intro');
  return (dispatch) => {
    dispatch(StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({
        routeName: 'SignInPage',
        key: 'SignInPage',
      })],
    }));
  };
}

