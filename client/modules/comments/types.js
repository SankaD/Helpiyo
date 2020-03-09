import helper from '../utils/type_helper';

const NAME = 'COMMENT';

export const SET_TARGET = helper(NAME, 'SET_TARGET');

export const LOAD_COMMENTS = helper(NAME, 'LOAD_COMMENTS');
export const LOAD_COMMENTS_FAILED = helper(NAME, 'LOAD_COMMENTS_FAILED');
export const COMMENTS_LOADED = helper(NAME, 'COMMENTS_LOADED');

export const CREATE_COMMENT = helper(NAME, 'CREATE_COMMENT');
export const CREATE_COMMENT_FAILED = helper(NAME, 'CREATE_COMMENT_FAILED');
export const COMMENT_CREATED = helper(NAME, 'COMMENT_CREATED');
