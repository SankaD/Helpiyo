import firebase from 'react-native-firebase';
import logger from '../../utils/logger';
import * as types from '../../services/types';
import { networkGet, networkPost } from '../../utils/url_helper';

const ServiceHandler = {
  createService: (serviceData) => {
    logger.info('ServiceHandler::createService');
    return networkPost('services/create-service', JSON.stringify(serviceData))
      .then((result) => {
        if (result.code === 200) {
          logger.info('service created successfully');
          return result.service;
        }
        logger.error(result);
        throw 'service-creation-failed';
      })
      .catch((error) => {
        logger.error(error);
        throw { miscError: error };
      });
  },
  updateService: (serviceData) => {
    logger.info('ServiceHandler::updateService');
    return networkPost('services/update-service', JSON.stringify(serviceData))
      .then((result) => {
        if (result.code === 200) {
          logger.info('service successfully updated');
          return result.service;
        }
        logger.error(error);
        throw 'service-creation-failed';
      })
      .catch((error) => {
        logger.error(error);
        throw { miscError: error };
      });
  },
  uploadImages: (serviceId, images) => {
    logger.info(`uploading images : ${serviceId}`);
    const imagesToDelete = [];
    const imagesToUpload = [];
    const promises = [];
    if (!firebase.auth().currentUser) {
      return Promise.reject('not-logged-in');
    }
    images.forEach((imageData) => {
      if (imageData.operation === 'add') {
        const path = `Profile/${firebase.auth().currentUser.uid}/Service/${serviceId}/${imageData.filename}`;
        logger.info(`adding image path : ${path}`);
        const retryTime = 30 * 1000;
        firebase.storage().setMaxUploadRetryTime(retryTime);
        const promise = firebase.storage()
          .ref(path)
          .putFile(imageData.url)
          .catch((error) => {
            logger.error(`Image upload failed : ${imageData.filename}`);
            logger.error(error);
            throw error;
          })
          .then((result) => {
            logger.info(`Image uploaded to temp location : ${imageData.filename}`);
            imagesToUpload.push(imageData.filename);
          });

        promises.push(promise);
      } else if (imageData.operation === 'remove') {
        imagesToDelete.push({
          filename: imageData.filename,
        });
      }
    });

    if (imagesToDelete.length > 0) {
      logger.info(`images to delete count : ${imagesToDelete.length}`);
      logger.debug(imagesToDelete);
      const promise = networkPost('common/delete-images', JSON.stringify({
        imagePaths: imagesToDelete,
        elementType: 'Service',
        elementId: serviceId,
      }));
      promises.push(promise);
    }
    logger.info('executing promises for image upload/delete');
    return Promise.all(promises)
      .then(() => {
        logger.info('informing the server of file upload');
        if (imagesToUpload.length > 0) {
          logger.debug(imagesToUpload);
          return networkPost('common/upload-images', JSON.stringify({
            elementId: serviceId,
            elementType: 'Service',
            imagePaths: imagesToUpload,
          }));
        }
        return Promise.resolve();
      })
      .then(() => networkGet(`common/update-images/Service/${serviceId}`))
      .catch((errors) => {
        logger.error(errors);
        throw { miscError: 'Uploading images failed' };
      });
  },
  activateService: (serviceId) => {
    logger.info('ServiceHandler::activateService');
    return networkGet(`services/activate-service/${serviceId}`)
      .then((result) => {
        if (result.code === 200) {
          logger.info('service activated successfully');
          return true;
        }
        logger.error(result);
        throw 'error';
      })
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  },
  getServices: (profileId) => {
    logger.info('ServiceHandler::getServices');

    return networkGet(`services/get-services/${profileId}`)
      .then((result) => {
        if (result.code === 200) {
          logger.info('services retrieved successfully');
          const { services, profiles } = result.results;
          services.forEach((service) => {
            service.creator = profiles[service.createdBy];
          });
          return services;
        }
        logger.error(result);
        throw 'error';
      })
      .catch((error) => {
        logger.error(error);
        throw 'error';
      });
  },
  getService: (serviceId) => {
    logger.info('ServiceHandler::getServices');

    return networkGet(`services/get-service/${serviceId}`)
      .then((result) => {
        if (result.code === 200) {
          logger.info('services retrieved successfully');
          const { services, profiles } = result.results;
          services.forEach((service) => {
            service.creator = profiles[service.createdBy];
          });
          return services[0];
        }
        logger.error(result);
        throw 'error';
      })
      .catch((error) => {
        logger.error(error);
        throw 'error';
      });
  },
  toggleEnable: (serviceId) => {
    logger.info(`toggle service enable :${serviceId}`);
    return networkGet(`services/toggle-service/${serviceId}`)
      .then((result) => {
        if (result.code === 200) {
          logger.info('service toggled successfully');
          return result.enabled;
        }
        logger.error(result);
        throw 'error';
      })
      .catch((error) => {
        logger.error(error);
        throw 'error';
      });
  },
  promoteService: (serviceId) => {
    logger.info(`ServiceHandler::promoteService : ${serviceId}`);
    return networkPost('services/promote', JSON.stringify({ serviceId }))
      .catch((error) => {
        logger.error(error);
        throw error;
      })
      .then(result => result.promoted);
  },
  isPromoted: (serviceId) => {
    logger.info(`ServiceHandler::isPromoted : ${serviceId}`);
    return networkGet(`services/has-promoted/${encodeURI(serviceId)}`)
      .catch((error) => {
        logger.error(error);
        throw error;
      })
      .then(result => result.promoted);
  },
  deleteService: (serviceId) => {
    logger.info(`ServiceHandler::deleteService : ${serviceId}`);
    return networkGet(`services/delete-service/${encodeURI(serviceId)}`)
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  },
};

export default ServiceHandler;
