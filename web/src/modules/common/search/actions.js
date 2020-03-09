import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/functions';
import * as types from './types';

export function search(text) {
    console.log("searching : " + text);

    return async dispatch => {
        dispatch({ type: types.SEARCH });

        try {
            if (text.length === 0) {
                dispatch({ type: types.SEARCH_COMPLETED, profiles: [], projects: [] });
                return;
            }
            const search = firebase.app().functions("europe-west1").httpsCallable("search");

            let result = await search({ text: text });
            let { profiles, projects } = result.data;

            dispatch({ type: types.SEARCH_COMPLETED, profiles: profiles, projects: projects });
        } catch (error) {
            console.error(error);
            dispatch({ type: types.SEARCH_FAILED, miscError: error.message });
        }
    };
}