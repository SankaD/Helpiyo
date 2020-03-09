import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
import { networkGet, networkPost } from '../../utils/url_helper';
import DataStore from '../data_stores';
import NetworkHandler from './network_handler';
import Logger from '../../utils/logger';
import RequestHandler from './request_handler';
import ResponseHandler from './response_handler';

const ProfileHandler = {
  getProfile(profileId) {
    Logger.info(`ProfileHandler::getting profile for ${profileId}`);
    return networkGet(`profiles/get/${encodeURIComponent(profileId)}`)
      .then(response => response.profile);
  },
  getMyProfile() {
    Logger.info('ProfileHandler::getting my profile');
    return networkGet('profiles/my')
      .then((response) => {
        if (!response.data) {
          Logger.info("couldn't get my profile");
        }
        return response.profile;
      });
  },
  followProfile(profileId) {
    Logger.info(`ProfileHandler::follow profile : ${profileId}`);
    return networkGet(`profiles/follow/${encodeURIComponent(profileId)}`)
      .then((result) => {
        Logger.info('profile followed');
      });
  },
  unfollowProfile(profileId) {
    Logger.info('ProfileHandler::unfollow profile');
    return networkGet(`profiles/unfollow/${encodeURIComponent(profileId)}`)
      .then((result) => {
        Logger.info('profile unfollowed');
      });
  },
  isFollowingProfile(profileId) {
    Logger.info('ProfileHandler::checking if profile is followed');
    return networkGet(`profiles/is-following/${encodeURIComponent(profileId)}`)
      .then((result) => {
        Logger.info(`profile is following : ${result.following}`);
        return result.following;
      });
  },
  registerToken(token) {
    Logger.info('ProfileHandler::registerToken');
    const uniqueId = DeviceInfo.getUniqueID();
    if (!uniqueId) {
      return Promise.reject('device-id-not-found');
    }

    return networkPost('profiles/register-device-token', JSON.stringify({ token, deviceId: uniqueId }))
      .then(() => {
        Logger.info('device token registered');
      })
      .catch((error) => {
        Logger.error(error);
        throw error;
      });
  },
  uploadImages: (profileId, imagePath, filename) => {
    Logger.info('uploading images');
    if (!firebase.auth().currentUser) {
      return Promise.reject('not-logged-in');
    }
    // const filename = filepath.path.split('/').pop();
    // const profileId = `Profile/${firebase.auth().currentUser.uid}`;
    const path = `gs://helpiyo-app-default/Profile/${profileId}/${filename}`;
    Logger.info(`path : ${path}`);
    return firebase.storage()
      .refFromURL(path)
      .putFile(imagePath)
      .catch((error) => {
        Logger.error(error);
        throw error;
      })
      .then((result) => {
        Logger.info(result);
      })
      .then(() => {
        Logger.info('informing the server of profile pic upload');
        return networkPost('profiles/upload-profile-pic', JSON.stringify({ imagePath: filename }));
      });
  },
  updateLocation: (token, latitude, longitude) => {
    Logger.info('updating location');

    return networkPost('profiles/update-location', JSON.stringify({ token, latitude, longitude }))
      .catch((error) => {
        Logger.error(error);
      });
  },
  getAchievements: (profileId) => {
    Logger.info(`getting achievements : ${profileId}`);
    return networkGet(`achievements/get/${profileId}`)
      .then(results => results.results);
  },
};

export default ProfileHandler;
