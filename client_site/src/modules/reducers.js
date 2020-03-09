import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

import authReducer from './auth/reducer';
import homeReducer from './home/reducer';
import globalReducer from './global/reducer';

export default (history) => combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    home: homeReducer,
    global: globalReducer
});