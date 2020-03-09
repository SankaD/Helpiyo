import helper from '../utils/type_helper';

const NAME = 'SETTINGS';

export const CHANGE_SOS_TIMER = helper(NAME, 'CHANGE_SOS_TIMER');

export const SHOW_PASSWORD_MODAL = helper(NAME, 'SHOW_PASSWORD_MODAL');
export const CHANGE_PASSWORD = helper(NAME, 'CHANGE_PASSWORD');
export const PASSWORD_CHANGED = helper(NAME, 'PASSWORD_CHANGED');
export const CHANGE_PASSWORD_FAILED = helper(NAME, 'CHANGE_PASSWORD_FAILED');

export const SHOW_FEEDBACK_MODAL = helper(NAME, 'SHOW_FEEDBACK_MODAL');
export const SUBMIT_FEEDBACK = helper(NAME, 'SUBMIT_FEEDBACK');
export const FEEDBACK_SUBMITTED = helper(NAME, 'FEEDBACK_SUBMITTED');
export const SUBMIT_FEEDBACK_FAILED = helper(NAME, 'SUBMIT_FEEDBACK_FAILED');

export const LOAD_INTERESTS = helper(NAME, 'LOAD_INTERESTS');
export const INTERESTS_LOADED = helper(NAME, 'INTERESTS_LOADED');
export const LOAD_INTERESTS_FAILED = helper(NAME, 'LOAD_INTERESTS_FAILED');

export const SET_INTERESTS = helper(NAME, 'SET_INTERESTS');
export const INTERESTS_SET = helper(NAME, 'INTERESTS_SET');
export const SET_INTERESTS_FAILED = helper(NAME, 'SET_INTERESTS_FAILED');
