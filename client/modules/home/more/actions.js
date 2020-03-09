import { AsyncStorage, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { GoogleSignin } from 'react-native-google-signin';
import firebase from 'react-native-firebase';
import Share from 'react-native-share';
import { Answers } from 'react-native-fabric';
import { LoginManager, ShareDialog } from 'react-native-fbsdk';
import branch from 'react-native-branch';
import Toast from '../../utils/toast';
import Logger from '../../utils/logger';
import ProfileHandler from '../../common/data_handlers/profile_handler';
import * as types from '../../profiles/types';
import { refreshProfile } from '../../global/actions';
import { networkGet, networkPost } from '../../utils/url_helper';

export function showProfile() {

}

export function showMessages() {
  Logger.info('showing message threads');
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'ThreadView', key: 'ThreadView' }));
  };
}

export function showSettings() {
  Logger.info('showing settings page');
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'SettingsView', key: 'SettingsView' }));
  };
}

export function showAchievements() {
  Logger.info('showing achievements');
  return (dispatch, getState) => {
    dispatch({ type: types.LOAD_PROFILE, profileId: getState().modules.global.profile._id });
    dispatch(NavigationActions.navigate({ routeName: 'BadgeView', key: 'BadgeView' }));
  };
}

export function signOut() {
  Logger.info('signing out');
  Answers.logCustom('signout');
  return (dispatch) => {
    ProfileHandler.registerToken('')
      .then(() => {
        // dispatch(NavigationActions.navigate({ routeName: 'LoadupPage', key: 'LoadupPage' }));
      })
      .then(() => {
        const promises = [];
        const currentProvider = firebase.auth().currentUser.providerId;
        Logger.info(`current provider : ${currentProvider}`);
        Logger.debug(firebase.auth().currentUser);
        Logger.debug(firebase.auth().currentUser.providerData);
        promises.push(Promise.resolve().then(() => GoogleSignin.signInSilently())
          .then((result) => {
            Logger.debug(result);
            if (!result) {
              Logger.info('provider is not google');
              return Promise.resolve();
            }
            GoogleSignin.configure({
              webClientId: '823051643542-tum0d57t9urh08sovv9u71nf5ts4c37g.apps.googleusercontent.com',
            });
            Logger.info('revoking google access');
            return GoogleSignin.revokeAccess()
              .then(() => {
                Logger.info('signing out from google');
                return GoogleSignin.signOut();
              });
          }).catch((error) => {
            Logger.info(error);
          }));

        promises.push(Promise.resolve(() => LoginManager.logOut()));

        return Promise.all(promises);
      })
      .then(() => {
        branch.logout();
        AsyncStorage.clear();
        firebase.auth().signOut();
        Toast.success('Successfully signed out');
      })
      .then(() => {
        dispatch(refreshProfile());
      })
      .catch((error) => {
        Logger.error(error);
      });
  };
}

export function showLeaderboard() {
  Logger.info('loading leaderboard');
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'LeaderBoard', key: 'LeaderBoard' }));
  };
}

export function setIntroduced() {
  Logger.info('setting introduced as true');
  return (dispatch) => {
    networkGet('profiles/set-introduced')
      .catch((error) => {
        Logger.error(error);
      })
      .then(() => {
        dispatch(refreshProfile());
      });
  };
}

export function inviteFriends() {
  Logger.info('inviting friends');
  return (dispatch, getState) => {
    const profileId = getState().modules.global.profile._id;
    const canonicalId = `${profileId}-${Date.now()}`;
    branch.createBranchUniversalObject(canonicalId, {
      locallyIndex: true,
      title: 'Helpiyo : Be a hero for Fun',
      contentDescription: 'Download today and earn valuable points',
      contentImageUrl: 'https://firebasestorage.googleapis.com/v0/b/helpiyo-app-public/o/public%2Ffeature_graphic.jpg?alt=media&token=8f1df999-86ef-45f4-a628-47ac89fa2bfc',
      keywords: ['app', 'download', 'services', 'help'],
      contentMetadata: {
        customMetadata: {
          referrer: profileId,
          itemCategory: 'referral',
        },
      },
    })
      .then((obj) => {
        Logger.info('showing share sheet');
        return obj.generateShortUrl({
          feature: 'referral',
          channel: 'app-menu',
        });
      })
      .then(({ url }) => Share.open({
        url,
        message: 'Hi, I joined Helpiyo. Join Helpiyo today with this link.',
        title: 'Invite others and earn credits',
        subject: 'Get what you need, when you need it',
      }))
      .then(() => {
        dispatch(setIntroduced());
      })
      .catch((error) => {
        Logger.error(error);
        dispatch(setIntroduced());
      });
  };
}

