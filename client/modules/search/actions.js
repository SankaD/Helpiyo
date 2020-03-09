import * as types from './types';
import { networkPost } from '../utils/url_helper';
import Toasts from '../utils/toast';
import Logger from '../utils/logger';

export function search(searchString, filters) {
  return ((dispatch) => {
    dispatch({ type: types.SEARCH, searchString });
    networkPost('search/search', JSON.stringify({
      text: searchString,
      count: 200,
      filter: filters,
    }))
      .then((response) => {
        Logger.info(response);
        const { requests, profiles, services } = response.results;
        requests.requests.forEach((request) => {
          request.creator = requests.profiles[request.createdBy];
        });
        services.services.forEach((service) => {
          service.creator = services.profiles[service.createdBy];
        });
        return { requests: requests.requests, profiles, services: services.services };
      })
      .then((results) => {
        dispatch({ type: types.SEACH_RESULTS_RECEIVED, results });
      })
      .catch((error) => {
        Logger.error(error);
        Toasts.error('Search failed. Please try again');
        dispatch({ type: types.SEARCH_FAILED });
      });
  });
}

export function changeFilter(filter) {
  return (dispatch) => {
    dispatch({ type: types.FILTER_CHANGED, filter });
  };
}
