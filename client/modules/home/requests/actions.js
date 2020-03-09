import { NavigationActions } from 'react-navigation';
import * as types from './types';
import * as responseTypes from '../../responses/types';
import RequestHandler from '../../common/data_handlers/request_handler';
import fillCreators from '../../utils/fill_creators';
import Toast from '../../utils/toast';
import Logger from '../../utils/logger';

export function getMyRequests() {
  Logger.info('getting my requests');
  return (dispatch) => {
    dispatch({ type: types.LOAD_REQUESTS });
    return RequestHandler.getMyRequests()
      .catch((errors) => {
        Logger.info('getting my requests failed');
        throw errors;
      })
      .then(requests => requests.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') {
          return -1;
        } else if (a.status !== 'active' && b.status === 'active') {
          return 1;
        }
        if (a.sos === true && b.sos === false) {
          return -1;
        } else if (a.sos === false && b.sos === true) {
          return 1;
        }
        if (a.createdOn < b.createdOn) {
          return 1;
        } else if (a.createdOn > b.createdOn) {
          return -1;
        }
        return 0;
      }))
      .then((requests) => {
        dispatch({ type: types.REQUESTS_LOADED, requests });
      })
      .catch((errors) => {
        Logger.info(errors);
        Toast.error('Loading requests failed');
        dispatch({ type: types.LOAD_REQUEST_FAILED, errors });
      });
  };
}

export function showResponsesForRequest(requestId) {
  Logger.info(`showing responses for request : ${requestId}`);
  return (dispatch) => {
    dispatch({ type: responseTypes.LOAD_RESPONSES_FOR_REQUEST, requestId });
    dispatch(NavigationActions.navigate({ routeName: 'ResponsesForRequest', key: 'ResponsesForRequest' }));
  };
}

export function showRatingModal(requestId) {
  Logger.info(`showing rating modal : ${requestId}`);
  return (dispatch) => {
    dispatch({ type: types.SHOW_RATING_MODAL, requestId });
  };
}

export function hideRatingModal() {
  Logger.info('hiding rating modal');
  return (dispatch) => {
    dispatch({ type: types.HIDE_RATING_MODAL });
  };
}

