import firebase from 'react-native-firebase';
import Logger from './logger';

const mainUrl = 'https://europe-west1-helpiyo-app.cloudfunctions.net/api';
// const mainUrl = 'http://10.0.2.2:5000/helpiyo-app/us-central1/api';
// const mainUrl = 'http://localhost:5000/helpiyo-app/us-central1/api';

export function getFullUrl(path) {
  const url = `${mainUrl}/${path}`;
  Logger.info(`network path : ${url}`);
  return url;
}

export function networkGet(path) {
  const url = getFullUrl(path);
  if (!firebase.auth().currentUser) {
    return Promise.reject('not-logged-in');
  }
  return firebase.auth().currentUser.getIdToken()
    .catch((error) => {
      Logger.error(error);
      throw error;
    })
    .then(token => fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        customauth: `Bearer ${token}`,
      },
    }))
    .then(response => response.json())
    .then((result) => {
      if (result.code !== 200) {
        Logger.error(result);
        throw result;
      }
      return result;
    });
}

export function networkPost(path, body) {
  const url = getFullUrl(path);
  if (!firebase.auth().currentUser) {
    return Promise.reject('not-logged-in');
  }
  return firebase.auth().currentUser.getIdToken()
    .catch((error) => {
      Logger.error(error);
      throw error;
    })
    .then(token => fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        customauth: `Bearer ${token}`,
      },
      body,
    }))
    .then(response => response.json())
    .then((result) => {
      if (result.code !== 200) {
        throw result;
      }
      return result;
    });
}
