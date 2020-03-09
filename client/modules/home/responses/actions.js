import Toast from '../../utils/toast';
import * as types from './types';
import ResponseHandler from '../../common/data_handlers/response_handler';
import fillCreators from '../../utils/fill_creators';
import Logger from '../../utils/logger';

export function getMyResponses() {
  Logger.info('getting my responses');
  return (dispatch) => {
    dispatch({ type: types.LOAD_RESPONSES });
    return ResponseHandler.getMyResponses()
      .catch((errors) => {
        Logger.info('getting my responses failed');
        throw errors;
      })
      .then(responses => responses.sort((a, b) => {
        const statusOrder = [];
        statusOrder.accepted = 0;
        statusOrder.active = 1;
        statusOrder.rejected = 2;
        statusOrder.completed = 3;

        if (statusOrder[a.status] > statusOrder[b.status]) {
          return 1;
        } else if (statusOrder[a.status] < statusOrder[b.status]) {
          return -1;
        }

        if (a.createdOn < b.createdOn) {
          return 1;
        } else if (a.createdOn > b.createdOn) {
          return -1;
        }
        return 0;
      }))
      .then((responses) => {
        dispatch({ type: types.RESPONSES_LOADED, responses });
      })
      .catch((errors) => {
        Logger.info(errors);
        Toast.error('Loading responses failed');
        dispatch({ type: types.LOAD_RESPONSES_FAILED, errors });
      });
  };
}

export function showRatingModal(responseId) {
  Logger.info(`showing response rating modal: ${responseId}`);
  return (dispatch) => {
    dispatch({ type: types.SHOW_RATING_MODAL, responseId });
  };
}

export function hideRatingModal() {
  Logger.info('hiding rating modal');
  return (dispatch) => {
    dispatch({ type: types.HIDE_RATING_MODAL });
  };
}

