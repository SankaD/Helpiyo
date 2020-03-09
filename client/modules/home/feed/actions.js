import * as types from './types';
import FeedHandler from '../../common/data_handlers/feed_handler';
import Toast from '../../utils/toast';
import Logger from '../../utils/logger';

export function loadFeed(latitude, longitude) {
  Logger.info('loading feed');
  return (dispatch) => {
    dispatch({ type: types.LOAD_FEED, latitude, longitude });
    return FeedHandler.getFeed(latitude, longitude)
      .then(({ requests, services }) => {
        const count = requests.length + services.length;
        const feed = [];

        Logger.info('adding adverts');

        let requestCounter = 0;
        let serviceCounter = 0;
        const tempIndex = Date.now();
        for (let i = 0; i < count; i += 1) {
          if (i % 10 === 0 && i > 0) {
            feed.push({
              type: 'advert',
              provider: 'google',
              _id: `${tempIndex + i}`,
            });
          } else if (i % 10 === 3 || i % 10 === 7 || requestCounter >= requests.length) {
            const service = services[serviceCounter];
            serviceCounter += 1;
            service.type = 'service';
            feed.push(service);
          } else {
            const request = requests[requestCounter];
            requestCounter += 1;
            request.type = 'request';
            feed.push(request);
          }
        }
        return feed;
      })
      .then((feed) => {
        dispatch({ type: types.FEED_LOADED, feed });
      })
      .catch((error) => {
        Logger.info('getting feed failed');
        Logger.error(error);
        Toast.error('Getting feed failed');
        dispatch({ type: types.FEED_LOAD_FAILED, error });
      });
  };
}


export function showRatingModal(requestId) {
  Logger.info(`showing rating modal : ${requestId}`);
  return (dispatch) => {
    dispatch({ type: types.SHOW_RATING_MODAL, requestId });
  };
}

export function reloadFeed() {
  Logger.info('reloading feed');
  return (dispatch) => {
    dispatch({ type: types.RELOAD_FEED });
  };
}
