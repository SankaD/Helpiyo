import { Answers } from 'react-native-fabric';
import Logger from '../utils/logger';
import RequestHandler from '../common/data_handlers/request_handler';
import * as types from './types';
import Toast from '../utils/toast';
import ResponseHandler from '../common/data_handlers/response_handler';

export function completeRequest(requestId, rating, comment) {
  Logger.info(`completing request : ${requestId}`);
  Answers.logCustom('request-completion', { requestId });
  return (dispatch) => {
    dispatch({ type: types.COMPLETE_REQUEST, requestId });
    if (!requestId) {
      Logger.error('request id is missing');
      dispatch({
        type: types.COMPLETE_REQUEST_FAILED,
        ratingError: 'Request ID missing',
      });
      return;
    }
    if (!rating) {
      Logger.error('rating is required');
      dispatch({
        type: types.COMPLETE_REQUEST_FAILED,
        ratingError: 'Rating is required',
      });
      return;
    }
    RequestHandler.completeRequest(requestId, rating, comment)
      .then(() => {
        Logger.info('request completed');
        dispatch({ type: types.REQUEST_COMPLETED });
        Toast.success('Request was completed successfully');
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error("Couldn't complete request");
        let errorString = 'Request completion failed';
        if (error === 'request-already-completed') {
          errorString = 'Request is already completed';
        } else if (error === 'validation-failure') {
          errorString = 'Validation failure occurred';
        }
        dispatch({ type: types.COMPLETE_REQUEST_FAILED, miscError: errorString });
      });
  };
}

export function completeResponse(responseId, rating, comment) {
  Logger.info(`completing response : ${responseId}`);
  Answers.logCustom('response-completion', { responseId });

  return (dispatch) => {
    dispatch({ type: types.COMPLETING_RESPONSE });
    if (!responseId) {
      Logger.error('response id is missing');
      dispatch({
        type: types.COMPLETE_RESPONSE_FAILED,
        ratingError: 'Response ID missing',
      });
      return;
    }
    if (!rating) {
      Logger.error('rating is required');
      dispatch({
        type: types.COMPLETE_RESPONSE_FAILED,
        ratingError: 'Rating is required',
      });
      return;
    }
    ResponseHandler.completeResponse(responseId, rating, comment)
      .then((result) => {
        Logger.info('response completed');
        Toast.success('Response completed successfully');
        dispatch({ type: types.RESPONSE_COMPLETED });
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error("Couldn't complete response");
        let errorString = 'Response completion failed';
        if (error === 'response-already-completed') {
          errorString = 'Response is already completed';
        } else if (error === 'validation-failure') {
          errorString = 'Validation failure occurred';
        } else if (error === 'response-not-accepted') {
          errorString = 'Response has not been accepted yet';
        }
        dispatch({ type: types.COMPLETE_RESPONSE_FAILED, miscError: errorString });
      });
  };
}


export function rejectResponse(responseId, rating, comment) {
  Logger.info(`rejecting response : ${responseId}`);
  Answers.logCustom('response-reject', { responseId });

  return (dispatch) => {
    dispatch({ type: types.REJECT_RESPONSE });
    if (!responseId) {
      Logger.error('response id is missing');
      dispatch({
        type: types.REJECT_RESPONSE_FAILED,
        ratingError: 'Response ID missing',
      });
      return;
    }
    if (!rating) {
      Logger.error('rating is required');
      dispatch({
        type: types.REJECT_RESPONSE_FAILED,
        ratingError: 'Rating is required',
      });
      return;
    }
    ResponseHandler.rejectResponse(responseId, rating, comment)
      .then((result) => {
        if (result.code !== 200) {
          let errorString = 'Response rejection failed';
          if (result.message === 'already-rejected') {
            Toast.show('Response is already rejected', Toast.SHORT);
            errorString = 'Response is already rejected';
          } else if (result.message === 'response-not-found') {
            Toast.show('Response not found', Toast.SHORT);
            errorString = 'Response not found';
          } else {
            Toast.show(result.message, Toast.SHORT);
          }
          dispatch({ type: types.REJECT_RESPONSE_FAILED, miscError: errorString });
          return;
        }
        Logger.info('response rejected');
        Toast.success('Response rejected successfully');
        Answers.logCustom('response-rejected', { responseId });
        dispatch({ type: types.RESPONSE_REJECTED });
      })
      .catch((error) => {
        Logger.error(error);
        let miscError = 'Something wrong happened';
        Answers.logCustom('response-reject-failed', { responseId });
        Toast.error("Couldn't reject response");
        if (error === 'response-not-accepted') {
          miscError = "Response hasn't been accepted yet";
        } else if (error === 'response-not-found') {
          miscError = "Response couldn't be found";
        } else if (miscError === 'already-rejected') {
          miscError = 'Response is already rejected';
        }
        dispatch({ type: types.REJECT_RESPONSE_FAILED, miscError });
      });
  };
}
