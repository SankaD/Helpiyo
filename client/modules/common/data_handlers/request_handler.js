import firebase from 'react-native-firebase';
import { networkGet, networkPost } from '../../utils/url_helper';
import NetworkHandler from './network_handler';
import Logger from '../../utils/logger';

const RequestHandler = {
  getRequest: (requestId) => {
    Logger.info(`RequestHandler::getRequest : ${requestId}`);
    return networkPost('requests/get-multiple', JSON.stringify([requestId]))
      .then((result) => {
        const { requests, profiles } = result.results;
        const request = requests[0];

        if (!request) return null;

        request.creator = profiles[request.createdBy];
        return request;
      });
  },
  getRequests: (requestIds) => {
    Logger.info('RequestHandler::getRequests ');
    return networkPost('requests/get-multiple', JSON.stringify(requestIds))
      .then((result) => {
        const { requests, profiles } = result.results;
        requests.forEach((request) => {
          request.creator = profiles[request.createdBy];
        });
        return requests;
      });
  },
  getRequestsForService: (serviceId) => {
    Logger.info('RequestHandler::getRequestsForService');
    return networkGet(`requests/get-for-service/${serviceId}`)
      .then((result) => {
        const { requests, profiles } = result.results;
        requests.forEach((request) => {
          request.creator = profiles[request.createdBy];
        });
        return requests;
      });
  },
  createRequest: (requestData) => {
    Logger.info('RequestHandler::createRequest');
    return networkPost('requests/create', JSON.stringify(requestData))
      .then((result) => {
        Logger.info('request created');
        return result.request;
      })
      .catch((error) => {
        Logger.info('request creation failed');
        throw error;
      });
  },
  editRequest: (requestData) => {
    Logger.info(`RequestHandler::editRequest : ${requestData._id}`);
    return networkPost('requests/edit', JSON.stringify(requestData))
      .then((result) => {
        Logger.info('request updated');
      })
      .catch((error) => {
        Logger.info('request update failed');
        throw error;
      });
  },
  uploadImages: (requestId, images) => {
    Logger.info(`uploading images : ${requestId}`);
    const imagesToDelete = [];
    const imagesToUpload = [];
    const promises = [];
    if (!firebase.auth().currentUser) {
      return Promise.reject('not-logged-in');
    }
    images.forEach((imageData) => {
      if (imageData.operation === 'add') {
        const path = `Profile/${firebase.auth().currentUser.uid}/Request/${requestId}/${imageData.filename}`;
        Logger.info(`adding image path : ${path}`);
        const retryTime = 30 * 1000;
        firebase.storage().setMaxUploadRetryTime(retryTime);
        const promise = firebase.storage()
          .ref(path)
          .putFile(imageData.url)
          .catch((error) => {
            Logger.error(`Image upload failed : ${imageData.filename}`);
            Logger.info(imageData);
            Logger.error(error);
            throw error;
          })
          .then((result) => {
            Logger.info(`Image uploaded to temp location : ${imageData.filename}`);
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
      Logger.info(`images to delete count : ${imagesToDelete.length}`);
      Logger.debug(imagesToDelete);
      const promise = networkPost('common/delete-images', JSON.stringify({
        imagePaths: imagesToDelete,
        elementType: 'Request',
        elementId: requestId,
      }));
      promises.push(promise);
    }
    Logger.info('executing promises for image upload/delete');
    return Promise.all(promises)
      .then(() => {
        Logger.info('informing the server of file upload');
        if (imagesToUpload.length > 0) {
          Logger.debug(imagesToUpload);
          return networkPost('common/upload-images', JSON.stringify({
            elementId: requestId,
            elementType: 'Request',
            imagePaths: imagesToUpload,
          }));
        }
        return Promise.resolve();
      })
      .then(() => networkGet(`common/update-images/Request/${requestId}`))
      .catch((errors) => {
        Logger.error(errors);
        throw 'Uploading images failed';
      });
  },
  deleteRequest: (requestId) => {
    Logger.info(`deleting request : ${requestId}`);
    return networkGet(`requests/delete/${encodeURIComponent(requestId)}`)
      .catch((error) => {
        Logger.error(error);
        throw error;
      });
  },
  activateRequest: (requestId) => {
    Logger.info(`RequestHandler::activateRequest : ${requestId}`);
    return networkGet(`requests/activate/${encodeURIComponent(requestId)}`)
      .catch((error) => {
        Logger.info('request activation failed');
        throw error;
      });
  },
  getMyRequests: () => {
    Logger.info('getting my requests');
    return networkGet('requests/get-my-requests')
      .catch((error) => {
        Logger.info('failed getting my requests via network');
        throw error;
      })
      .then((result) => {
        Logger.debug(result);
        const { requests, profiles } = result.results;
        requests.forEach((request) => {
          request.creator = profiles[request.createdBy];
        });
        Logger.debug(requests);
        return requests;
      });
  },
  getRequestsBy: (profileId) => {
    Logger.info('getting my requests');
    return networkGet(`requests/get-active-requests-by/${encodeURIComponent(profileId)}`)
      .catch((error) => {
        Logger.error('failed getting requests by user');
        throw error;
      })
      .then((result) => {
        Logger.debug(result);
        const { requests, profiles } = result.results;
        requests.forEach((request) => {
          request.creator = profiles[request.createdBy];
        });

        Logger.debug(requests);
        return requests;
      })
      .then(requests => requests.sort((a, b) => {
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
      }));
  },
  completeRequest: (requestId, rating, comment) => {
    Logger.info(`RequestHandler::completeRequest ${requestId}`);
    return networkPost('requests/complete', JSON.stringify({
      requestId,
      rating,
      comment,
    }))
      .catch((error) => {
        Logger.info('completing request failed');
        throw error;
      });
  },
  getNearestRequests: (latitude, longitude, radius) => {
    Logger.info(`RequestHandler::getNearestRequests : ${latitude} : ${longitude} : ${radius}`);
    return networkGet(`requests/get-nearest/${latitude}/${longitude}/${radius}`)
      .catch((error) => {
        Logger.error(error);
        throw error;
      })
      .then((result) => {
        Logger.info('nearest requests received');
        Logger.info(result);
        const { requests, profiles } = result.results;
        requests.forEach((request) => {
          request.creator = profiles[request.createdBy];
        });
        return requests;
      });
  },
  promoteRequest: (requestId) => {
    Logger.info(`RequestHandler::promoteRequest : ${requestId}`);
    return networkPost('requests/promote', JSON.stringify({ requestId }))
      .catch((error) => {
        Logger.error(error);
        throw error;
      })
      .then(result => result.promoted);
  },
  isPromoted: (requestId) => {
    Logger.info(`RequestHandler::isPromoted : ${requestId}`);
    return networkGet(`requests/has-promoted/${encodeURI(requestId)}`)
      .catch((error) => {
        Logger.error(error);
        throw error;
      })
      .then(result => result.promoted);
  },
};

export default RequestHandler;
