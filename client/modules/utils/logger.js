import firebase from 'react-native-firebase';
import { Crashlytics } from 'react-native-fabric';
import { Platform } from 'react-native';


const logError = (err) => {
  if (Platform.OS === 'ios') {
    Crashlytics.recordError(err);
  } else if (Platform.OS === 'android') {
    Crashlytics.logException(err);
  } else {
    console.error(`unidentified OS : ${Platform.OS}`);
  }
};

export default class Logger {
    static userId='';
    static info(message) {
      if (__DEV__) {
        console.log(message);
      } else {
        firebase.crashlytics().log(JSON.stringify(message));
      }
    }
    static error(message) {
      if (__DEV__) {
        // console.error(message);
        console.warn(message);
      } else {
        logError(JSON.stringify(message));
      }
    }
    static debug(message) {
      if (__DEV__) { console.log(message); }
    }
}

