import validator from 'validator';
import { NavigationActions } from 'react-navigation';
import { Answers } from 'react-native-fabric';
import Branch from 'react-native-branch';
import Share from 'react-native-share';
import { Alert } from 'react-native';
import Toast from '../utils/toast';
import * as types from './types';
import RequestHandler from '../common/data_handlers/request_handler';
import fillCreators from '../utils/fill_creators';
import Logger from '../utils/logger';
import * as responseTypes from '../responses/types';
import * as ratingTypes from '../ratings/types';
import { networkGet } from '../utils/url_helper';

function validate(requestData) {
  let hasError = false;
  const errors = { miscError: '' };
  if (!requestData.post) {
    Logger.info('post is required');
    hasError = true;
    errors.postError = 'Post is required';
  } else if (validator.isLength(requestData.post, { max: 500 }) === false) {
    Logger.info('Post needs to have at most 400 characters');
    hasError = true;
    errors.postError = 'Post needs to have at most 400 characters';
  }
  if (requestData.money && validator.isCurrency(`${requestData.money}`) === false) {
    Logger.info(`currency amount is invalid : ${requestData.money}`);
    hasError = true;
    errors.currencyError = 'Currency amount is invalid';
  }
  if (requestData.startTime && requestData.endTime && requestData.startTime > requestData.endTime) {
    Logger.info('Start time is after end time');
    hasError = true;
    errors.timeError = 'Start time is after the end time';
  }
  if (requestData.sos) {
    requestData.tags.push('sos');
  }
  return { hasError, errors };
}

export function loadRequests(requestIds) {
  Logger.info('loading requests');
  return (dispatch, getState) => {
    dispatch({ type: types.LOAD_REQUESTS });
  };
}
export function loadRequest(requestId) {
  Logger.info('loading request');
  return (dispatch, getState) => {
    dispatch({ type: types.LOAD_REQUEST, requestId });

    RequestHandler.getRequest(requestId)
      .then((request) => {
        dispatch({ type: types.REQUEST_LOADED, request });
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error("Couldn't load request");
        dispatch({ type: types.LOAD_REQUEST_FAILED });
      });
  };
}
export function promote(requestId) {
  Logger.info('promoting request');
  Answers.logCustom('request-promotion', { requestId });

  return (dispatch) => {
    dispatch({ type: types.PROMOTE_REQUEST, requestId });
    RequestHandler.promoteRequest(requestId)
      .then((promoted) => {
        if (promoted) {
          Answers.logCustom('request-promoted', { requestId });
        } else {
          Answers.logCustom('request-demoted', { requestId });
        }
        dispatch({ type: types.REQUEST_PROMOTED, requestId });
        return promoted;
      })
      .catch((error) => {
        Answers.logCustom('request-promotion-failed', { requestId });
        Toast.error(error);
        dispatch({ type: types.PROMOTE_REQUEST_FAILED, error, requestId });
      });
  };
}

export function shareRequest(request, profileId) {
  Logger.info('sharing request to social media');
  return (dispatch) => {
    Branch.setIdentity(profileId);
    return Branch.createBranchUniversalObject(`Request/${request._id}`, {
      locallyIndex: true,
      title: `Help ${request.createdBy === profileId ? ' me...' : ' someone...'}`,
      contentDescription: request.post,
      contentImageUrl: request.photos[0] ? request.photos[0].thumbnail : '',
      contentMetadata: {
        customMetadata: {
          requestId: request._id,
          referrer: profileId,
          itemCategory: 'request',
        },
      },
    })
      .then((obj) => {
        Logger.info('showing share sheet');
        return obj.generateShortUrl({
          feature: 'share',
          channel: 'request',
        });
      })
      .then(({ url }) => Share.open({
        url,
        message: request.post,
        title: `Help ${request.createdBy === profileId ? ' me...' : ' someone...'}`,
        subject: 'Sharing a Helpiyo request',
      }));
  };
}

export function isPromoted(requestId) {
  Logger.info('is promoted request');
  return (dispatch) => {
    dispatch({ type: types.CHECK_PROMOTED });
    return RequestHandler.isPromoted(requestId)
      .catch((error) => {
        Toast.error(error);
        dispatch({ type: types.CHECK_PROMOTED_FAILED, error });
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
function activateRequest(requestId, dispatch) {
  Logger.info(`activating request : ${requestId}`);

  dispatch({ type: types.ACTIVATING_REQUEST, id: requestId });
  return RequestHandler.activateRequest(requestId);
}
function createRequest(requestData) {
  Logger.info('creating request');
  Answers.logCustom('request-creation');

  return (dispatch, getState) => {
    dispatch({ type: types.CREATING_REQUEST });
    const { hasError, errors } = validate(requestData);
    if (hasError) {
      Logger.info(requestData);
      Logger.info(errors);
      Toast.error('Creating request failed with validation failures');
      dispatch({ type: types.CREATE_REQUEST_FAILED, errors });
      return;
    }

    let requestId;
    RequestHandler.createRequest(requestData)
      .then(request => RequestHandler.uploadImages(request._id, requestData.photos).then(() => request)
        .catch((error) => {
          throw { miscError: error };
        }))
      .then((request) => {
        requestId = request._id;
        return activateRequest(requestId, dispatch)
          .then(() => request);
      })
      .then((request) => {
        Answers.logCustom('request-created');
        Toast.show('Request created successfully', Toast.durations.SHORT, Toast.colors.GREEN);
        dispatch({ type: types.REQUEST_CREATED, requestId });
        dispatch(NavigationActions.back());
        Alert.alert('Share with friends', 'Do you want to share this request ?', [
          {
            text: 'Share', onPress: () => shareRequest(request, request.createdBy),
          },
          {
            text: 'Cancel', style: 'cancel', onDismiss: () => { },
          },
        ]);
      })
      .catch((error) => {
        Answers.logCustom('request-creation-failed');
        Logger.error(error);
        Toast.error('Creating request failed');
        dispatch({ type: types.CREATE_REQUEST_FAILED, errors: { miscError: error.miscError } });
      });
  };
}

function editRequest(requestData) {
  Logger.info('editing request');
  Answers.logCustom('request-amend', { requestId: requestData._id });

  return (dispatch) => {
    const { hasError, errors } = validate(requestData);
    if (hasError) {
      Logger.info(requestData);
      Logger.info(errors);
      dispatch({ type: types.CREATE_REQUEST_FAILED, errors });
      return;
    }
    dispatch({ type: types.CREATING_REQUEST });
    RequestHandler.editRequest(requestData)
      .then(() => RequestHandler.uploadImages(requestData._id, requestData.photos).then(() => requestData)
        .catch((error) => {
          throw { miscError: error };
        }))
      .then(() => {
        Answers.logCustom('request-amended', { requestId: requestData._id });
        Toast.show('Request updated successfully', Toast.durations.SHORT, Toast.colors.GREEN);
        dispatch({ type: types.REQUEST_EDITED, requestId: requestData._id });
        dispatch(NavigationActions.back());
      })
      .catch((error) => {
        Answers.logCustom('request-amend-failed', { requestId: requestData._id });
        Logger.error(error);
        Toast.error('Updating request failed');
        dispatch({ type: types.EDIT_REQUEST_FAILED, errors: { miscError: error.miscError } });
      });
  };
}
export function saveElement(requestData) {
  if (requestData._id) {
    return editRequest(requestData);
  }

  return createRequest(requestData);
}

export function showRequest(requestId) {
  Logger.info('showing request');
  return (dispatch) => {
    dispatch({ type: types.SHOW_REQUEST, requestId });
    dispatch(NavigationActions.navigate({ routeName: 'RequestPage', key: 'RequestPage' }));
  };
}
export function loadEditRequestPage(requestId) {
  Logger.info(`editing request : ${requestId}`);
  return (dispatch) => {
    RequestHandler.getRequest(requestId)
      .then((request) => {
        if (request) {
          dispatch({ type: types.EDIT_REQUEST, request });
          dispatch(NavigationActions.navigate({ routeName: 'RequestEditor', key: 'RequestEditor', params: { mode: 'edit' } }));
        } else {
          Toast.error('Request not found');
        }
      });
  };
}
export function deleteRequest(requestId) {
  Logger.info(`deleting request : ${requestId}`);
  Answers.logCustom('request-deletion', { requestId });
  return ((dispatch) => {
    dispatch({ type: types.DELETE_REQUEST });
    if (!requestId) {
      dispatch({ type: types.DELETE_REQUEST_FAILED });
      return;
    }
    RequestHandler.deleteRequest(requestId)
      .then(() => {
        Answers.logCustom('request-deleted', { requestId });
        Logger.info('delete request');
        dispatch({ type: types.REQUEST_DELETED });
        Toast.show('Request deleted successfully', Toast.durations.SHORT, Toast.colors.GREEN);
      })
      .catch((error) => {
        Answers.logCustom('request-deletion-failed', { requestId });
        Logger.error(error);
        dispatch({ type: types.DELETE_REQUEST_FAILED, error });
        if (error === 'request-not-found') {
          Toast.error('Request not found');
        } else if (error === 'invalid-status') {
          Toast.error("Couldn't delete request as request was not active");
        } else if (error === 'active-responses-exist') {
          Toast.error("Couldn't delete request as active responses exists");
        } else {
          Toast.error("Couldn't delete request");
        }
      });
  });
}

export function acceptRequest(request) {
  Logger.info('accepting request');
  return (dispatch) => {
    dispatch({ type: responseTypes.CREATE_RESPONSE, request });
    dispatch(NavigationActions.navigate({ routeName: 'ResponseEditor', key: 'ResponseEditor', params: { mode: 'create' } }));
  };
}

export function completeRequest(requestId) {
  Logger.info('completing request');
  return (dispatch) => {
    dispatch({ type: ratingTypes.LOAD_RATING_PAGE, elementType: 'request', elementId: requestId });
    dispatch(NavigationActions.navigate({ routeName: 'RatingsPage', key: 'RatingsPage' }));
  };
}
export function gotoRequestsForService(serviceId) {
  return (dispatch) => {
    dispatch({ type: types.SHOW_REQUESTS_FOR_SERVICE, serviceId });
    dispatch(NavigationActions.navigate({ routeName: 'RequestsForService', key: 'RequestsForService' }));
  };
}
export function getRequestsForService(serviceId) {
  Logger.info(`getting requests for service : ${serviceId}`);
  return (dispatch) => {
    dispatch({ type: types.LOAD_REQUESTS_FOR_SERVICE });
    if (!serviceId) {
      Toast.error('Loading requests for service failed. Service Id not found');
      dispatch({ type: types.LOAD_REQUESTS_FOR_SERVICE_FAILED });
      return;
    }
    RequestHandler.getRequestsForService(serviceId)
      .then((requests) => {
        dispatch({ type: types.REQUESTS_FOR_SERVICE_LOADED, requests });
      })
      .catch((error) => {
        Toast.error('Loading requests for service failed');
        dispatch({ type: types.LOAD_REQUESTS_FOR_SERVICE_FAILED });
      });
  };
}

export function boostRequest(requestId) {
  Logger.info('boosting request');
  return (dispatch) => {
    networkGet(`/common/boost-item/boost-request/${requestId}`)
      .then((result) => {
        Toast.success('Request boosted');
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error('Request boosting failed');
      });
  };
}
