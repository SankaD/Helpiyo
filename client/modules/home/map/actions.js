import Toast from '../../utils/toast';
import * as types from './types';
import RequestHandler from '../../common/data_handlers/request_handler';
import Logger from '../../utils/logger';

export function getNearestRequests(latitude, longitude, radius) {
  Logger.info(`getting nearest requests : ${latitude} : ${longitude} : ${radius}`);
  return (dispatch) => {
    dispatch({ type: types.GET_NEARBY_REQUESTS });
    RequestHandler.getNearestRequests(latitude, longitude, radius)
      .then((requests) => {
        dispatch({ type: types.NEARBY_REQUESTS_RECEIVED, requests });
      })
      .catch((error) => {
        Logger.error(error);
        dispatch({ type: types.GET_NEARBY_REQUESTS_FAILED, error });
        Toast.error('Getting nearest requests failed');
      });
  };
}

export function getSosSignals() {
  Logger.info('getting SOS signals');
}
