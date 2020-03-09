import validator from 'validator';
import { NavigationActions } from 'react-navigation';
import { Answers } from 'react-native-fabric';
import * as types from './types';
import ResponseHandler from '../common/data_handlers/response_handler';
import fillCreators from '../utils/fill_creators';
import Toast from '../utils/toast';
import Logger from '../utils/logger';
import * as ratingTypes from '../ratings/types';

function validateResponse(responseData) {
  Logger.info('validating response data');
  const errors = { miscError: '' };
  let hasError = false;

  if (!responseData.post) {
    Logger.info('post is required');
    hasError = true;
    errors.postError = 'Post is required';
  } else if (validator.isLength(responseData.post, { max: 400 }) === false) {
    Logger.info('Post needs to have at most 400 characters');
    hasError = true;
    errors.postError = 'Post needs to have at most 400 characters';
  }
  if (responseData.money && validator.isCurrency(`${responseData.money}`) === false) {
    Logger.info(`currency amount is invalid : ${responseData.money}`);
    hasError = true;
    errors.currencyError = 'Currency amount is invalid';
  }

  if (responseData.startTime && responseData.endTime && responseData.startTime > responseData.endTime) {
    Logger.info('Start time is after end time');
    hasError = true;
    errors.timeError = 'Start time is after the end time';
  }
  return { hasError, errors };
}

function activateResponse(responseId, dispatch) {
  Logger.info('activating response');
  dispatch({ type: types.ACTIVATING_RESPONSE, responseId });
  return ResponseHandler.activateResponse(responseId);
}

function editResponse(responseData) {
  Logger.info(`editing response : ${responseData._id}`);
  Answers.logCustom('response-amend', { responseId: responseData._id });
  return (dispatch) => {
    const { hasError, errors } = validateResponse(responseData);
    if (hasError) {
      Logger.info(responseData);
      Logger.info(errors);
      dispatch({ type: types.EDIT_RESPONSE_FAILED, errors });
      return;
    }
    dispatch({ type: types.EDITING_RESPONSE });
    ResponseHandler.editResponse(responseData)
      .then(() => {
        Answers.logCustom('response-amended', { responseId: responseData._id });
        Toast.success('Response updates successfully');
        dispatch({ type: types.RESPONSE_EDITED });
        dispatch(NavigationActions.back());
      })
      .catch((error) => {
        Answers.logCustom('response-amend-failed', { responseId: responseData._id });
        Logger.error(error);
        Toast.error('Updating response failed');
        let miscError = 'Something went wrong';
        if (error === 'validation-failure') {
          miscError = 'Validation failed for response';
        }
        dispatch({ type: types.EDIT_RESPONSE_FAILED, errors: { miscError } });
      });
  };
}
function createResponse(responseData) {
  Logger.info(`creating response for requestId : ${responseData.requestId}`);
  Logger.info(responseData);
  Answers.logCustom('response-creation', { requestId: responseData.requestId });

  return (dispatch, getState) => {
    const { hasError, errors } = validateResponse(responseData);
    if (hasError) {
      Logger.info(responseData);
      Logger.info(errors);
      dispatch({ type: types.CREATE_RESPONSE_FAILED, errors });
      return;
    }
    dispatch({ type: types.CREATING_RESPONSE });
    let responseId;
    ResponseHandler.createResponse(responseData)
      .then(response => ResponseHandler.uploadImages(response._id, responseData.photos).then(() => response))
      .then((response) => {
        responseId = response._id;
        return activateResponse(response._id, dispatch);
      })
      .then(() => {
        Answers.logCustom('response-created', { requestId: responseData.requestId });
        Toast.success('Response created successfully');
        dispatch({ type: types.RESPONSE_CREATED, responseId });
        dispatch(NavigationActions.back());
      })
      .catch((error) => {
        Answers.logCustom('response-creation-failed', { requestId: responseData.requestId });
        Logger.error(error);
        let errorString = 'An error has occurred in our server';
        if (error === 'validation-failure') {
          errorString = 'A validation failure occurred';
        } else if (error === 'already-responded') {
          errorString = 'You have already responded to this request';
        }
        Toast.error(`Creating response failed. ${errorString}`);
        dispatch({ type: types.CREATE_RESPONSE_FAILED, errors: { miscError: errorString } });
      });
  };
}
export function saveElement(responseData) {
  if (responseData._id) {
    return editResponse(responseData);
  }

  return createResponse(responseData);
}
export function loadResponsesForRequest(requestId) {
  Logger.info(`loading responses for request : ${requestId}`);
  return (dispatch) => {
    dispatch({ type: types.LOADING_RESPONSES_FOR_REQUEST });
    return ResponseHandler.getResponsesForRequest(requestId)
      .then((responses) => {
        dispatch({ type: types.RESPONSES_FOR_REQUEST_LOADED, responses });
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error('Loading responses failed');
        dispatch({ type: types.LOAD_RESPONSES_FOR_REQUEST_FAILED, error });
      });
  };
}

export function acceptResponse(responseId) {
  Logger.info(`accepting response : ${responseId}`);
  Answers.logCustom('response-accept', { responseId });

  return (dispatch) => {
    dispatch({ type: types.ACCEPTING_RESPONSE, responseId });
    return ResponseHandler.acceptResponse(responseId)
      .then((result) => {
        Answers.logCustom('response-accepted', { responseId });
        Logger.info('response accepted');
        dispatch({ type: types.RESPONSE_ACCEPTED });
      })
      .catch((error) => {
        Answers.logCustom('response-accept-failed', { responseId });
        Logger.error(error);
        Toast.error('Accepting response failed');
        dispatch({ type: types.ACCEPTING_RESPONSE_FAILED });
      });
  };
}


export function deleteResponse(responseId) {
  Logger.info('deleting response');
  Answers.logCustom('response-delete', { responseId });
  return (dispatch) => {
    dispatch({ type: types.DELETE_RESPONSE });
    return ResponseHandler.deleteResponse(responseId)
      .then(() => {
        Answers.logCustom('response-deleted', { responseId });
        Logger.info('response deleted');
        Toast.success('Response deleted successfully');
        dispatch({ type: types.RESPONSE_DELETED });
      })
      .catch((error) => {
        Answers.logCustom('response-delete-failed', { responseId });
        Logger.error(error);
        if (error === 'response-not-found') {
          Toast.error("Couldn't delete response as response cannot be found");
        } else if (error === 'response-not-active') {
          Toast.error("Couldn't delete response as response is not active");
        } else {
          Toast.error("Couldn't delete response");
        }
        dispatch({ type: types.DELETE_RESPONSE_FAILED });
      });
  };
}

export function loadEditResponsePage(responseId) {
  Logger.info('showing edit response view');
  return (dispatch) => {
    ResponseHandler.getResponse(responseId)
      .then((response) => {
        if (response) {
          dispatch({ type: types.EDIT_RESPONSE, response });
          dispatch(NavigationActions.navigate({ routeName: 'ResponseEditor', key: 'ResponseEditor', params: { mode: 'edit' } }));
        } else {
          Toast.error('Cannot edit response');
          dispatch({ type: types.EDIT_RESPONSE_FAILED });
        }
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error('Cannot edit response');
        dispatch({ type: types.EDIT_RESPONSE_FAILED });
      });
  };
}
export function completeResponse(responseId) {
  Logger.info('completing request');
  return (dispatch) => {
    dispatch({ type: ratingTypes.LOAD_RATING_PAGE, elementType: 'response', elementId: responseId });
    dispatch(NavigationActions.navigate({ routeName: 'RatingsPage', key: 'RatingsPage' }));
  };
}

export function rejectResponse(responseId) {
  Logger.info('rejecting request');
  return (dispatch) => {
    dispatch({ type: ratingTypes.LOAD_RATING_PAGE, elementType: 'reject', elementId: responseId });
    dispatch(NavigationActions.navigate({ routeName: 'RatingsPage', key: 'RatingsPage' }));
  };
}
export function loadResponse(responseId) {
  Logger.info('loading request');
  return (dispatch, getState) => {
    dispatch({ type: types.LOAD_RESPONSE, requestId: responseId });

    ResponseHandler.getResponse(responseId)
      .then((response) => {
        dispatch({ type: types.RESPONSE_LOADED, response });
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error("Couldn't load response");
        dispatch({ type: types.LOAD_RESPONSE_FAILED });
      });
  };
}

export function showResponse(responseId) {
  Logger.info('show response');
  return (dispatch) => {
    dispatch({ type: types.SHOW_RESPONSE, responseId });
    dispatch(NavigationActions.navigate({ routeName: 'ResponsePage', key: 'ResponsePage' }));
  };
}
