import * as types from './types';
import { PROFILE_CREATED } from '../auth/verify_page/types';

export default (state = { newProfile: true, launchedFromLink: false }, action) => {
  switch (action.type) {
    case types.ERROR:
      return Object.assign({}, state, {
        error: action.error,
      });
    case types.SET_PROFILE:
      return Object.assign({}, state, {
        profile: action.profile,
      });
    case PROFILE_CREATED:
      return Object.assign({}, state, {
        newProfile: true,
      });
    case types.TUTORIAL_OVER:
      return Object.assign({}, state, {
        newProfile: false,
      });
    case types.LAUNCHED_FROM_LINK:
      return Object.assign({}, state, {
        launchedFromLink: true,
      });
    case types.CONSUME_LAUNCHED_FROM_LINK:
      return Object.assign({}, state, {
        launchedFromLink: false,
      });
    default:
      return Object.assign({}, state);
  }
};
