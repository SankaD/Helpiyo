import { combineReducers } from 'redux';

import authReducer from './auth/reducers';
import homeReducer from './home/reducers';
import requestReducer from './requests/reducer';
import globalReducer from './global/reducer';
import responseReducer from './responses/reducer';
import profileReducer from './profiles/reducer';
import reporterReducer from './reporter/reducer';
import messageReducer from './messages/reducers';
import commentReducer from './comments/reducer';
import settingsReducer from './settings/reducer';
import notificationReducer from './notifications/reducer';
import leaderboardReducer from './leaderboard/reducer';
import searchReducer from './search/reducer';
import ratingReducer from './ratings/reducer';
import imageReducer from './image_view/reducer';
import serviceReducer from './services/reducer';

const reducers = combineReducers({
  auth: authReducer,
  home: homeReducer,
  requests: requestReducer,
  responses: responseReducer,
  global: globalReducer,
  profiles: profileReducer,
  reporter: reporterReducer,
  messages: messageReducer,
  comments: commentReducer,
  settings: settingsReducer,
  notifications: notificationReducer,
  leaderboard: leaderboardReducer,
  search: searchReducer,
  ratings: ratingReducer,
  imageView: imageReducer,
  services: serviceReducer,
});

export default (state, action) => {
  if (action.type === 'RESET_STATE') {
    return reducers(undefined, action);
  }
  return reducers(state, action);
};
