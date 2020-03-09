import { NavigationActions } from 'react-navigation';
import { Answers } from 'react-native-fabric';
import * as types from './types';
import ProfileHandler from '../common/data_handlers/profile_handler';
import Toast from '../utils/toast';
import Logger from '../utils/logger';
import RequestHandler from '../common/data_handlers/request_handler';
import { networkPost, networkGet } from '../utils/url_helper';

export function followProfile(profileId) {
  Logger.info(`following profile : ${profileId}`);
  Answers.logCustom('profile-follow', { profileId });
  return (dispatch) => {
    dispatch({ type: types.FOLLOW_PROFILE, profileId });
    ProfileHandler.followProfile(profileId)
      .then(() => {
        dispatch({ type: types.PROFILE_FOLLOWED, profileId });
        // dispatch({ type: types.FOLLOWING_CHECKED, following: true });
        Answers.logCustom('profile-followed', { profileId });
      })
      .catch((error) => {
        Logger.error(error);
        if (error === 'already-followed') {
          Toast.error('You are already following the user');
        } else {
          Toast.error('Something went wrong while following user');
        }
        dispatch({ type: types.FOLLOW_PROFILE_FAILED });
        Answers.logCustom('profile-follow-failed', { profileId });
      });
  };
}

export function unfollowProfile(profileId) {
  Logger.info(`unfollowing profile : ${profileId}`);
  Answers.logCustom('profile-unfollow', { profileId });
  return (dispatch) => {
    dispatch({ type: types.UNFOLLOW_PROFILE, profileId });
    ProfileHandler.unfollowProfile(profileId)
      .then(() => {
        dispatch({ type: types.PROFILE_UNFOLLOWED, profileId });
        // dispatch({ type: types.FOLLOWING_CHECKED, following: false });
        Answers.logCustom('profile-unfollowed', { profileId });
      })
      .catch((error) => {
        Logger.error(error);
        if (error === 'user-not-following') {
          Toast.error('You are already not following the user');
        } else {
          Toast.error('Something went wrong while following user');
        }
        dispatch({ type: types.UNFOLLOW_PROFILE_FAILED });
        Answers.logCustom('profile-unfollow-failed', { profileId });
      });
  };
}

export function showProfile(profileId) {
  Logger.info(`showing profile : ${profileId}`);
  return (dispatch, getState) => {
    if (getState().modules.global.profile._id === profileId) {
      dispatch({ type: types.LOAD_PROFILE, profileId });
      dispatch(NavigationActions.navigate({ routeName: 'MyProfile', key: 'MyProfile' }));
    } else {
      dispatch({ type: types.LOAD_PROFILE, profileId });
      dispatch(NavigationActions.navigate({ routeName: 'OtherProfile', key: 'OtherProfile' }));
    }
  };
}
export function showAchievements() {
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'BadgeView', key: 'BadgeView' }));
  };
}

export function showWallet() {
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'WalletPage', key: 'WalletPage' }));
  };
}

export function loadProfile(profileId) {
  Logger.info(`loading profile : ${profileId}`);
  return (dispatch) => {
    dispatch({ type: types.LOADING_PROFILE });
    ProfileHandler.getProfile(profileId)
      .then((profile) => {
        Logger.info('profile loaded');
        Logger.info(profile);
        dispatch({ type: types.PROFILE_LOADED, profile });
      })
      .catch((error) => {
        Logger.error(error);
        dispatch({ type: types.LOAD_PROFILE_FAILED, error });
      });
  };
}

export function isFollowing(profileId) {
  Logger.info(`is following profile : ${profileId}`);
  return (dispatch) => {
    dispatch({ type: types.CHECKING_FOLLOWING });
    ProfileHandler.isFollowingProfile(profileId)
      .then((following) => {
        Logger.info(`profile followed : ${following}`);
        dispatch({ type: types.FOLLOWING_CHECKED, following });
      })
      .catch((error) => {
        Logger.error(error);
        dispatch({ type: types.CHECKING_FOLLOWING_FAILED, error });
      });
  };
}

export function loadAchievements(profileId) {
  Logger.info(`loading achievements : ${profileId}`);
  return (dispatch) => {
    dispatch({ type: types.LOAD_BADGES, profileId });
    ProfileHandler.getAchievements(profileId)
      .then((achievements) => {
        Logger.info(achievements);
        dispatch({ type: types.BADGES_LOADED, achievements });
      })
      .catch((error) => {
        Logger.error(error);
        Toast.error('Loading achievements failed');
        dispatch({ type: types.LOAD_BADGES_FAILED, error });
      });
  };
}

export function uploadProfilePic(profileId, imagePath) {
  Logger.info('uploading profile pic');
  return (dispatch) => {
    dispatch({ type: types.UPLOAD_PROFILE_PIC });
    return ProfileHandler.uploadImages(profileId, imagePath, `profile-pic-${Date.now()}.jpg`)
      .then(() => {
        dispatch({ type: types.PROFILE_PIC_UPLOADED });
        Toast.success('Image uploaded successfully');
      })
      .catch((error) => {
        Logger.error(error);
        dispatch({ type: types.UPLOAD_PROFILE_PIC_FAILED });
        Toast.error('Image upload failed');
      });
  };
}

export function loadActivities(profileId) {
  Logger.info('loading activities');
  return (dispatch) => {
    dispatch({ type: types.LOAD_ACTIVITIES, profileId });
    return RequestHandler.getRequestsBy(profileId)
      .then((results) => {
        dispatch({ type: types.ACTIVITIES_LOADED, activities: results });
      })
      .catch((error) => {
        Toast.error('Loading user activity failed');
        Logger.error(error);
        dispatch({ type: types.LOAD_ACTIVITIES_FAILED });
      });
  };
}

export function openDisplayNameModal() {
  return (dispatch) => {
    Logger.info('showing display name modal');
    dispatch({ type: types.SHOW_DISPLAY_NAME_MODAL });
  };
}

export function hideDisplayNameModal() {
  return (dispatch) => {
    Logger.info('hiding display name modal');
    dispatch({ type: types.HIDE_DISPLAY_NAME_MODAL });
  };
}

export function changeDisplayName(displayName) {
  return (dispatch) => {
    Logger.info('changing display name');
    dispatch({ type: types.CHANGE_DISPLAY_NAME, displayName });
    let hasErrors = false;
    let error = '';
    if (!displayName || displayName === '') {
      Logger.info('hero name is required');
      hasErrors = true;
      error = 'Please provide a hero name';
      Toast.error('Hero name is required');
    } else if (/^[a-zA-Z0-9][a-zA-Z .0-9]*[a-zA-Z0-9]$/.test(displayName) !== true) {
      Logger.info(`Not a valid hero name : ${displayName}`);
      hasErrors = true;
      Toast.error('Hero name should only have numbers, letters, periods and spaces');
      error = 'Please provide only numbers, letters, periods and spaces';
    }
    if (hasErrors) {
      dispatch({ type: types.CHANGE_DISPLAY_NAME_FAILED, displayNameError: error });
      return;
    }
    networkPost('profiles/change-hero-name', JSON.stringify({ heroName: displayName }))
      .then((result) => {
        Toast.success('Hero name changed successfully');
        dispatch({ type: types.DISPLAY_NAME_CHANGED });
      })
      .catch((error) => {
        Logger.error(error);
        if (error === 'hero-name-exists') {
          dispatch({ type: types.CHANGE_DISPLAY_NAME_FAILED, displayNameError: 'Hero Name already in use' });
        } else {
          dispatch({ type: types.CHANGE_DISPLAY_NAME_FAILED, displayNameError: 'Hero Name change failed' });
        }
        Toast.error('Hero name  change failed');
      });
  };
}

export function loadKarmaData() {
  return (dispatch) => {
    dispatch({ type: types.LOAD_WALLET_DATA });
    networkGet('profiles/get-karma-data')
      .then((result) => {
        dispatch({ type: types.WALLET_DATA_LOADED, karmaPoints: result.karmaPoints, karmaActivity: result.karmaActivities });
      })
      .catch((error) => {
        Toast.error('Loading karma activities failed');
        Logger.error(error);
        dispatch({ type: types.LOAD_WALLET_DATA_FAILED });
      });
  };
}
