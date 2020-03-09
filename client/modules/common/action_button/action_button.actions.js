import { NavigationActions } from 'react-navigation';
import { Alert } from 'react-native';
import * as requestEditorTypes from '../../requests/types';
import * as serviceTypes from '../../services/types';
import Logger from '../../utils/logger';

export function openRequestCreator() {
  Logger.info('Opening request creator');
  return (dispatch, getState) => {
    dispatch({
      type: requestEditorTypes.CREATE_REQUEST,
      sos: false,
      defaultCurrency: getState().modules.global.profile.defaultCurrency,
    });
    dispatch(NavigationActions.navigate({ routeName: 'RequestEditor', key: 'RequestEditor', params: { mode: 'create' } }));
  };
}

export function openSosCreator() {
  Logger.info('Opening SOS creator');
  return (dispatch, getState) => {
    Alert.alert('SOS confirmation', 'Do you have an "urgent" request?\nIf not please create a normal request.', [
      {
        text: 'Create ',
        onPress: () => {
          dispatch({
            type: requestEditorTypes.CREATE_REQUEST,
            sos: true,
            defaultCurrency: getState().modules.global.profile.defaultCurrency,
          });
          dispatch(NavigationActions.navigate({ routeName: 'RequestEditor', key: 'RequestEditor', params: { mode: 'sos' } }));
        },
      },
      {
        text: 'Cancel', style: 'cancel', onDismiss: () => { },
      },
    ]);
  };
}

export function openServiceCreator() {
  Logger.info('Opening service creator');
  return (dispatch) => {
    dispatch({ type: serviceTypes.SHOW_SERVICE_EDITOR });
    dispatch(NavigationActions.navigate({ routeName: 'ServiceEditor', key: 'ServiceEditor', params: { mode: 'create' } }));
  };
}
