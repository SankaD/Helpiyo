import { NavigationActions } from 'react-navigation';
import validator from 'validator';
import { Answers } from 'react-native-fabric';
import Branch from 'react-native-branch';
import Share from 'react-native-share';
import { Alert } from 'react-native';
import logger from '../utils/logger';
import { networkGet, networkPost } from '../utils/url_helper';
import Toast from '../utils/toast';
import * as types from './types';
import ServiceHandler from '../common/data_handlers/service_handler';
import * as requestEditorTypes from '../requests/types';
import RequestHandler from '../common/data_handlers/request_handler';
import { shareRequest } from '../requests/actions';

function validate(serviceData) {
  let hasError = false;
  const errors = { miscError: '' };
  // if (!serviceData.title) {
  //   logger.info('title is required');
  //   hasError = true;
  //   errors.titleError = 'Title is required';
  // } else if (validator.isLength(serviceData.title, { max: 100 }) === false) {
  //   logger.info('title length is too long');
  //   hasError = true;
  //   error.titleError = 'Title should be less than 100 characters';
  // }
  if (!serviceData.post) {
    logger.info('description is required');
    hasError = true;
    errors.postError = 'Description is required';
  } else if (validator.isLength(serviceData.post, { max: 1500 }) === false) {
    logger.info('Description needs to have at most 1500 characters');
    hasError = true;
    errors.postError = 'Description needs to have at most 1500 characters';
  }
  if (serviceData.money && validator.isCurrency(`${serviceData.money}`) === false) {
    logger.info(`currency amount is invalid : ${serviceData.money}`);
    hasError = true;
    errors.currencyError = 'Currency amount is invalid';
  }
  return { hasError, errors };
}
export function showServices(profile) {
  return (dispatch) => {
    dispatch({ type: types.SHOW_SERVICE_LIST, profile });
    dispatch(NavigationActions.navigate({ routeName: 'ServiceList' }));
  };
}
export function loadServiceEditor(service) {
  return (dispatch) => {
    dispatch({ type: types.SHOW_SERVICE_EDITOR, service });
    dispatch(NavigationActions.navigate({ routeName: 'ServiceEditor', key: 'ServiceEditor', params: { mode: 'create' } }));
  };
}
export function deleteService(serviceId) {
  return (dispatch) => {
    dispatch({ type: types.DELETE_SERVICE, serviceId });
    ServiceHandler.deleteService(serviceId)
      .then(() => {
        dispatch({ type: types.SERVICE_DELETED });
      })
      .catch((error) => {
        dispatch({ type: types.DELETE_SERVICE_FAILED });
      });
  };
}

export function shareService(service, profileId) {
  logger.info('sharing service to social media');
  return (dispatch) => {
    Branch.setIdentity(profileId);
    return Branch.createBranchUniversalObject(`service/${service._id}`, {
      locallyIndex: true,
      title: 'Check this out...',
      contentDescription: service.post,
      contentImageUrl: service.photos[0] ? service.photos[0].thumbnail : '',
      contentMetadata: {
        customMetadata: {
          referrer: profileId,
          serviceId: service._id,
          itemCategory: 'service',
        },
      },
    })
      .then((obj) => {
        logger.info('showing share sheet');
        return obj.generateShortUrl({
          feature: 'share',
          channel: 'service',
        });
      })
      .then(({ url }) => Share.open({
        url,
        message: service.post,
        title: 'Check this out...',
        subject: 'Sharing a Helpiyo service',
      }));
  };
}
export function createService(serviceData) {
  logger.info('creating service');
  return (dispatch) => {
    dispatch({ type: types.CREATE_SERVICE });
    const { hasError, errors } = validate(serviceData);
    if (hasError) {
      logger.info(serviceData);
      logger.info(errors);
      dispatch({ type: types.CREATE_SERVICE_FAILED, errors });
      Toast.error('Creating service failed with validation errors');
      return;
    }
    ServiceHandler.createService(serviceData)
      .then(service => ServiceHandler.uploadImages(service._id, serviceData.photos)
        .then(() => ServiceHandler.activateService(service._id)).then(() => service))
      .then((service) => {
        Toast.success('Service created');
        dispatch({ type: types.SERVICE_CREATED });
        dispatch(NavigationActions.back());
        Alert.alert('Share with friends', 'Do you want to share this service ?', [
          {
            text: 'Share', onPress: () => shareService(service, service.createdBy),
          },
          {
            text: 'Cancel', style: 'cancel', onDismiss: () => { },
          },
        ]);
      })
      .catch((errors) => {
        logger.error(errors);
        dispatch({ type: types.CREATE_SERVICE_FAILED, errors });
      });
  };
}
export function updateService(serviceData) {
  logger.info('service updated');
  return (dispatch) => {
    dispatch({ type: types.UPDATE_SERVICE });
    return ServiceHandler.updateService(serviceData)
      .then(service => ServiceHandler.uploadImages(service._id, serviceData.photos))
      .then(() => {
        Toast.success('Service updated');
        dispatch({ type: types.SERVICE_UPDATED });
        dispatch(NavigationActions.back());
      })
      .catch((errors) => {
        logger.error(errors);
        dispatch({ type: types.UPDATE_SERVICE_FAILED, errors });
      });
  };
}

export function saveService(serviceData) {
  logger.info('saving service');
  return (dispatch) => {
    const method = serviceData._id ? updateService : createService;
    dispatch(method(serviceData));
  };
}
export function createRequest(serviceId) {
  return (dispatch, getState) => {
    dispatch({
      type: requestEditorTypes.CREATE_REQUEST,
      sos: false,
      defaultCurrency: getState().modules.global.profile.defaultCurrency,
      serviceId,
    });
    dispatch(NavigationActions.navigate({ routeName: 'RequestEditor', key: 'RequestEditor', params: { mode: 'create' } }));
  };
}
export function getServices(profileId) {
  logger.info('getting services');
  return (dispatch) => {
    dispatch({ type: types.LOAD_SERVICES, profileId });
    ServiceHandler.getServices(profileId)
      .then(services => services.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') {
          return -1;
        } if (a.status !== 'active' && b.status === 'active') {
          return 1;
        }

        if (a.createdOn < b.createdOn) {
          return 1;
        } if (a.createdOn > b.createdOn) {
          return -1;
        }
        return 0;
      }))
      .then((services) => {
        logger.info('services loaded');
        dispatch({ type: types.SERVICES_LOADED, services });
      })
      .catch((errors) => {
        logger.error(errors);
        Toast.error('Loading services failed');
        dispatch({ type: types.LOAD_SERVICES_FAILED, errors });
      });
  };
}
export function toggleService(serviceId) {
  logger.info('toggle service');
  return (dispatch) => {
    dispatch({ type: types.TOGGLE_SERVICE, serviceId });
    ServiceHandler.toggleEnable(serviceId)
      .then(() => {
        logger.info('toggled status');
        dispatch({ type: types.SERVICE_TOGGLED });
      })
      .catch((error) => {
        logger.error(error);
        Toast.error('Toggling service enable/disable failed');
        dispatch({ type: types.TOGGLE_SERVICE_FAILED });
      });
  };
}

export function promote(serviceId) {
  logger.info('promoting service');
  Answers.logCustom('request-promotion', { serviceId });

  return (dispatch) => {
    dispatch({ type: types.PROMOTE_SERVICE, serviceId });
    ServiceHandler.promoteService(serviceId)
      .then((promoted) => {
        if (promoted) {
          Answers.logCustom('service-promoted', { serviceId });
        } else {
          Answers.logCustom('service-demoted', { serviceId });
        }
        dispatch({ type: types.SERVICE_PROMOTED, serviceId });
        return promoted;
      })
      .catch((error) => {
        Answers.logCustom('service-promotion-failed', { serviceId });
        Toast.error(error);
        dispatch({ type: types.PROMOTE_SERVICE_FAILED, error, serviceId });
      });
  };
}
export function loadService(serviceId) {
  logger.info(`loading service : ${serviceId}`);
  return (dispatch) => {
    dispatch({ type: types.LOAD_SERVICE, serviceId });
    ServiceHandler.getService(serviceId)
      .then((service) => {
        if (service) {
          dispatch({ type: types.SERVICE_LOADED, service });
        } else {
          Toast.error('Loading service failed. Service not found');
          dispatch({ type: types.LOAD_SERVICE_FAILED, miscError: 'service-not-found' });
        }
      })
      .catch((error) => {
        logger.error(error);
        Toast.error('Loading service failed');
        dispatch({ type: types.LOAD_SERVICE_FAILED, error });
      });
  };
}

export function isPromoted(serviceId) {
  logger.info('is promoted service');
  return (dispatch) => {
    dispatch({ type: types.CHECK_PROMOTED });
    return ServiceHandler.isPromoted(serviceId)
      .catch((error) => {
        Toast.error(error);
        dispatch({ type: types.CHECK_PROMOTED_FAILED, error });
      });
  };
}

export function showService(serviceId) {
  logger.info(`showing service : ${serviceId}`);
  return (dispatch) => {
    dispatch({ type: types.SHOW_SERVICE, serviceId });
    dispatch(NavigationActions.navigate({ routeName: 'ServicePage', key: 'ServicePage' }));
  };
}
