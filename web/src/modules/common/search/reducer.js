import * as types from './types';

const initialState = {
    projects: [],
    profiles: [],
    miscError: null,
    searching: false,
};
export default (state = initialState, action) => {
    if (action.type === types.SEARCH) {
        return Object.assign({}, state, {
            miscError: null,
            searching: true,
        });
    } else if (action.type === types.SEARCH_COMPLETED) {
        return Object.assign({}, state, {
            projects: action.projects,
            profiles: action.profiles,
            searching: false,
        });
    } else if (action.type === types.SEARCH_FAILED) {
        return Object.assign({}, state, {
            miscError: action.miscError,
            projects: [],
            profiles: [],
            searching: false,
        });
    }
    return state;
};