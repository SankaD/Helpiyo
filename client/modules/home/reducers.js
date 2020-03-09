import { combineReducers } from 'redux';

import homeReducer from './home_page/reducer';
import requestReducer from './requests/reducer';
import responseReducer from './responses/reducer';
import feedReducer from './feed/reducer';
import mapReducer from './map/reducer';
import titleBarReducer from '../common/title_bar/title_bar.reducers';

export default combineReducers({
  home: homeReducer,
  requests: requestReducer,
  responses: responseReducer,
  map: mapReducer,
  titleBar: titleBarReducer,
  feed: feedReducer,
});
