import helper from '../utils/type_helper';

const NAME = 'ratings';

export const LOAD_RATING_PAGE = helper(NAME, 'LOAD_RATING_PAGE');

export const SAVE_RATING = helper(NAME, 'SAVE_RATING');


export const COMPLETE_REQUEST = helper(NAME, 'COMPLETE_REQUEST');
export const REQUEST_COMPLETED = helper(NAME, 'REQUEST_COMPLETED');
export const COMPLETE_REQUEST_FAILED = helper(NAME, 'COMPLETE_REQUEST_FAILED');

export const COMPLETE_RESPONSE = helper(NAME, 'COMPLETE_RESPONSE');
export const COMPLETING_RESPONSE = helper(NAME, 'COMPLETING_RESPONSE');
export const RESPONSE_COMPLETED = helper(NAME, 'RESPONSE_COMPLETED');
export const COMPLETE_RESPONSE_FAILED = helper(NAME, 'COMPLETE_RESPONSE_FAILED');

export const REJECT_RESPONSE = helper(NAME, 'REJECT_RESPONSE');
export const RESPONSE_REJECTED = helper(NAME, 'RESPONSE_REJECTED');
export const REJECT_RESPONSE_FAILED = helper(NAME, 'REJECT_RESPONSE_FAILED');
