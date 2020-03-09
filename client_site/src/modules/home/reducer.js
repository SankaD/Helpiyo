import * as types from './types';

const initialState = {
    element: null,
};

export default (state = initialState, action) => {
    if (action.type === types.LOAD_ELEMENT) {
        return state;
    } else if (action.type === types.ELEMENT_LOADED) {
        return Object.assign({}, state, {
            element: action.element,
        });
    } else if (action.type === types.LOAD_ELEMENT_FAILED) {
        return Object.assign({}, state, {
            element: null,
            error: action.error,
        });
    }
    return state;
};