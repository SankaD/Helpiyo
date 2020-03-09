import * as types from './types';

export function signIn(email, password) {
    console.log("signing in");

    return dispatch => {
        dispatch({type: types.SignIn});
    }
}

export function signOut() {

}

export function signUp(email, password, confirmation) {

}

export function verify() {
    
}