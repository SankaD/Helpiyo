import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';


import homeReducer from './home/reducer';

export default (history) => combineReducers({
    router: connectRouter(history),
    home: homeReducer,
});
