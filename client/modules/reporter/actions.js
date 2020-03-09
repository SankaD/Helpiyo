import { NavigationActions } from 'react-navigation';
import { Answers } from 'react-native-fabric';
import Toast from '../utils/toast';
import NetworkHandler from '../common/data_handlers/network_handler';
import * as types from './types';
import Logger from '../utils/logger';

export function report(elementId, comment, category, elementType) {
  Logger.info('reporting');
  Answers.logCustom('report', { elementId });
  return (dispatch) => {
    dispatch({ type: types.REPORTING_ITEM });
    const handler = new NetworkHandler('general');
    handler.reportElement(elementId, comment, category, elementType)
      .then((result) => {
        Logger.info(result);
        if (result.code !== 200) {
          throw result;
        }
        dispatch({ type: types.ITEM_REPORTED });
        dispatch(NavigationActions.back());
        Toast.success('Report delivered successfully');
        Answers.logCustom('reported', { elementId });
      })
      .catch((error) => {
        dispatch({ type: types.REPORT_ITEM_FAILED, error });
        Toast.error('Report delivery failed');
        Answers.logCustom('report-failed', { elementId });
      });
  };
}

export function showReporter(id, type) {
  Logger.info('showing reporter');
  return (dispatch) => {
    dispatch({ type: types.REPORT_ITEM, elementId: id, elementType: type });
    dispatch(NavigationActions.navigate({ routeName: 'Reporter', key: 'Reporter' }));
  };
}
