import firebase from 'react-native-firebase';
import { networkPost, networkGet } from '../../utils/url_helper';
import NetworkHandler from './network_handler';
import Logger from '../../utils/logger';

const ResponseHandler = {
  createResponse: (responseData) => {
    Logger.info('ResponseHandler::createResponse');
    return networkPost('responses/create', JSON.stringify(responseData))
      .then((result) => {
        Logger.info('response created');
        if (!result.response) {
          throw result;
        }
        return result.response;
      })
      .catch((error) => {
        Logger.info('response creation failed');
        throw error;
      });
  },
  uploadImages: (responseId, images) => {
    Logger.info(`uploading images : ${responseId}`);
    const imagesToDelete = [];
    const imagesToUpload = [];
    const promises = [];
    if (!firebase.auth().currentUser) {
      return Promise.reject('not-logged-in');
    }
    images.forEach((imageData) => {
      if (imageData.operation === 'add') {
        Logger.info('adding image');

        const path = `Profile/${firebase.auth().currentUser.uid}/Response/${responseId}/${imageData.filename}`;
        Logger.info(`path : ${path}`);
        const promise = firebase.storage()
          .ref(path)
          .putFile(imageData.url)
          .catch((error) => {
            Logger.error(error);
            throw error;
          })
          .then((result) => {
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
      const promise = networkPost('common/delete-images', JSON.stringify({
        imagePaths: imagesToDelete,
        elementType: 'Response',
        elementId: responseId,
      }));
      promises.push(promise);
    }
    return Promise.all(promises)
      .then(() => {
        Logger.info('informing the server of file upload');
        return networkPost('common/upload-images', JSON.stringify({
          elementId: responseId,
          elementType: 'Response',
          imagePaths: imagesToUpload,
        }));
      })
      .then(() => networkGet(`common/update-images/Response/${responseId}`))
      .catch((errors) => {
        Logger.error(errors);
        throw 'Uploading images failed';
      });
  },
  editResponse: (responseData) => {
    Logger.info('ResponseHandler::editResponse');
    return networkPost('responses/edit', JSON.stringify(responseData))
      .then((result) => {
        Logger.info('response updated');
      })
      .catch((error) => {
        Logger.info('response update failed');
        throw error;
      });
  },
  activateResponse: (responseId) => {
    Logger.info(`activating response : ${responseId}`);
    return networkGet(`responses/activate/${encodeURIComponent(responseId)}`)
      .catch((error) => {
        Logger.info('response activation failed');
        throw error;
      });
  },
  getMyResponses: () => {
    Logger.info('ResponseHandler::getMyResponses');
    return networkGet('responses/get-my')
      .then((result) => {
        const { responses, profiles } = result.results;
        responses.forEach((response) => {
          response.creator = profiles[response.createdBy];
        });
        return responses;
      })
      .catch((error) => {
        Logger.info('getting my responses failed');
        throw error;
      });
  },
  getResponsesForRequest: (requestId) => {
    Logger.info(`ResponseHandler::getResponsesForRequest : ${requestId}`);
    return networkGet(`responses/get-responses-for/${encodeURIComponent(requestId)}`)
      .then((result) => {
        const { responses, profiles } = result.results;
        responses.forEach((response) => {
          response.creator = profiles[response.createdBy];
        });
        return responses;
      })
      .catch((error) => {
        Logger.error('getting responses for request failed');
        throw error;
      });
  },
  acceptResponse: (responseId) => {
    Logger.info(`ResponseHandler::acceptResponse : ${responseId}`);
    return networkGet(`responses/accept/${encodeURIComponent(responseId)}`)
      .catch((error) => {
        Logger.error('accepting response failed');
        throw error;
      });
  },
  completeResponse: (responseId, rating, comment) => {
    Logger.info(`ResponseHandler::completeResponse : ${responseId}`);
    return networkPost('responses/complete', JSON.stringify({
      responseId,
      rating,
      comment,
    }))
      .catch((error) => {
        Logger.error('completing response failed');
        throw error;
      });
  },
  deleteResponse: (responseId) => {
    Logger.info(`ResponseHandler::deleteResponse : ${responseId}`);
    return networkGet(`responses/delete/${encodeURIComponent(responseId)}`)
      .catch((error) => {
        Logger.error('deleting response failed');
        throw error;
      });
  },
  rejectResponse: (responseId, rating, comment) => {
    Logger.info(`ResponseHandler::rejectResponse : ${responseId}`);
    return networkPost('responses/reject', JSON.stringify({
      rating,
      comment,
      responseId,
    }))
      .catch((error) => {
        Logger.error('rejecting response failed');
        throw error;
      });
  },
  getResponse: (responseId) => {
    Logger.info(`ResponseHandler::getResponse : ${responseId}`);

    return networkPost('responses/get-multiple', JSON.stringify([responseId]))
      .then((result) => {
        const { responses, profiles } = result.results;
        responses.forEach((response) => {
          response.creator = profiles[response.createdBy];
        });
        return responses[0];
      });
  },
};

export default ResponseHandler;
