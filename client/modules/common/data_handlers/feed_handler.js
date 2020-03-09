import { networkGet } from '../../utils/url_helper';
import NetworkHandler from './network_handler';
import Logger from '../../utils/logger';

const FeedHandler = {
  getFeed(latitude, longitude) {
    Logger.info(`getting feed : ${latitude}:${longitude}`);

    return networkGet(`feed/get-v2/${latitude}/${longitude}`)
      .then((feed) => {
        Logger.info('feed received');
        Logger.info(feed);
        const { services, requests, profiles } = feed.results;
        services.map((service) => {
          service.creator = profiles[service.createdBy];
          return service;
        });
        requests.map((request) => {
          request.creator = profiles[request.createdBy];
          return request;
        });
        return { requests, services };
      })
      .catch((error) => {
        Logger.info('getting the feed failed');
        throw error;
      });
  },
};

export default FeedHandler;
