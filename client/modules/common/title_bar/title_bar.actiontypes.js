import helper from '../../utils/type_helper';

const NAME = 'COMMON/TITLE_BAR';

export const SEARCH = helper(NAME, 'SEARCH');
export const SEARCH_RESULTS_RECEIVED = helper(NAME, 'SEARCH_RESULTS_RECEIVED');
export const SEARCH_FAILED = helper(NAME, 'SEARCH_FAILED');
export const DISCARD_SEARCH_RESULTS = helper(NAME, 'DISCARD_SEARCH_RESULTS');
export const MESSAGE_RECEIVED = helper(NAME, 'MESSAGE_RECEIVED');
export const NOTIFICATION_RECEIVED = helper(NAME, 'NOTIFICATION_RECEIVED');
export const SOS_NOTIFICATION_RECEIVED = helper(NAME, 'SOS_NOTIFICATION_RECEIVED');
export const OPEN_NOTIFICATIONS = helper(NAME, 'OPEN_NOTIFICATIONS');
export const OPEN_MESSAGES = helper(NAME, 'OPEN_MESSAGES');

export const GET_NOTIFICATION_COUNT = helper(NAME, 'GET_NOTIFICATION_COUNT');
export const NOTIFICATION_COUNT_RECEIVED = helper(NAME, 'NOTIFICATION_COUNT_RECEIVED');
export const GET_NOTIFICATION_COUNT_FAILED = helper(NAME, 'GET_NOTIFICATION_COUNT_FAILED');

export const GET_MESSAGE_COUNT = helper(NAME, 'GET_MESSAGE_COUNT');
export const MESSAGE_COUNT_RECEIVED = helper(NAME, 'MESSAGE_COUNT_RECEIVED');
export const GET_MESSAGE_COUNT_FAILED = helper(NAME, 'GET_MESSAGE_COUNT');
