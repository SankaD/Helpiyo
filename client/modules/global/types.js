import helper from '../utils/type_helper';

const NAME = 'GLOBAL';

export const SET_TOKEN = helper(NAME, 'SET_TOKEN');
export const SET_PROFILE = helper(NAME, 'SET_PROFILE');
export const ERROR = helper(NAME, 'ERROR');
export const SIGN_OUT = helper(NAME, 'SIGN_OUT');

export const UPDATE_FCM_TOKEN = helper(NAME, 'UPDATE_FCM_TOKEN');
export const FCM_TOKEN_UPDATED = helper(NAME, 'FCM_TOKEN_UPDATED');
export const UPDATE_FCM_TOKEN_FAILED = helper(NAME, 'UPDATE_FCM_TOKEN_FAILED');

export const TUTORIAL_OVER = helper(NAME, 'TUTORIAL_OVER');

export const LAUNCHED_FROM_LINK = helper(NAME, 'LAUNCHED_FROM_LINK');
export const CONSUME_LAUNCHED_FROM_LINK = helper(NAME, 'CONSUME_LAUNCHED_FROM_LINK');
