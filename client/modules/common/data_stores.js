import { Cache } from 'react-native-cache';
import { AsyncStorage } from 'react-native';
import Logger from '../utils/logger';

const DataStore = {
  caches: {},
  // backend: MemoryStore,
  backend: AsyncStorage,
  init() {
    Logger.info('initializing data stores');
    this.caches.requests = new Cache({
      namespace: 'requests',
      policy: {
        maxEntries: 5000,
      },
      backend: this.backend,
    });
    this.caches.profiles = new Cache({
      namespace: 'profiles',
      policy: {
        maxEntries: 5000,
      },
      backend: this.backend,
    });
    this.caches.responses = new Cache({
      namespace: 'responses',
      policy: {
        maxEntries: 5000,
      },
      backend: this.backend,
    });
    this.caches.threads = new Cache({
      namespace: 'threads',
      policy: {
        maxEntries: 5000,
      },
      backend: this.backend,
    });
    this.caches.messages = new Cache({
      namespace: 'messages',
      policy: {
        maxEntries: 5000,
      },
      backend: this.backend,
    });
    this.caches.comments = new Cache({
      namespace: 'comments',
      policy: {
        maxEntries: 5000,
      },
      backend: this.backend,
    });
  },
  getCache(cacheName) {
    const cache = this.caches[cacheName];
    if (!cache) {
      Logger.info('Cache not found');
      throw Error('Cache not found');
    }
    return cache;
  },
  getElement(cacheName, elementId) {
    Logger.info(`DateStore::getElement : ${elementId} from cache : ${cacheName}`);

    if (typeof elementId !== typeof 'String') {
      Logger.error(`invalid element id type : ${typeof (elementId)}`);
      return Promise.reject({ miscError: 'invalid-cache-key-type' });
    } else if (!elementId || !cacheName || elementId === '' || cacheName === '') {
      Logger.error('invalid-cache-access');
      return Promise.reject({ miscError: 'invalid-cache-access' });
    }
    return new Promise((resolve, reject) => {
      const cache = this.getCache(cacheName);
      return cache.getItem(elementId, (error, value) => {
        if (error) {
          Logger.error(error);
          reject(error);
          return;
        }
        if (!value) {
          Logger.info(`element not found in the store : ${elementId}`);
        } else {
          Logger.info('element received : ');
          Logger.info(value);
        }

        resolve(value);
      });
    });
  },
  setElement(cacheName, elementId, element) {
    Logger.info(`setting element:${elementId} in cache: ${cacheName}`);
    return new Promise((resolve, reject) => {
      try {
        const cache = this.getCache(cacheName);
        cache.setItem(elementId, element, (error, value) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(value);
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  resetCaches() {
    // todo : implement these
  },
};

export default DataStore;
