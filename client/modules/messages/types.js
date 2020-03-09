import helper from '../utils/type_helper';

const NAME = 'messages';

export const LOAD_THREADS = helper(NAME, 'LOAD_THREADS');
export const THREADS_LOADED = helper(NAME, 'THREADS_LOADED');
export const LOAD_THREAD_FAILED = helper(NAME, 'LOAD_THREAD_FAILED');

export const OPEN_THREAD = helper(NAME, 'OPEN_THREAD');
export const OPENING_THREAD_FAILED = helper(NAME, 'OPENING_THREAD_FAILED');
export const CLOSE_THREAD = helper(NAME, 'CLOSE_THREAD');

export const LOAD_MESSAGES = helper(NAME, 'LOAD_MESSAGES');
export const MESSAGES_LOADED = helper(NAME, 'MESSAGES_LOADED');
export const LOAD_MESSAGES_FAILED = helper(NAME, 'LOAD_MESSAGES_FAILED');

export const CREATE_THREAD = helper(NAME, 'CREATE_THREAD');
export const THREAD_CREATED = helper(NAME, 'THREAD_CREATED');
export const CREATE_THREAD_FAILED = helper(NAME, 'CREATE_THREAD_FAILED');

export const CREATE_MESSAGE = helper(NAME, 'CREATE_MESSAGE');
export const MESSAGE_CREATED = helper(NAME, 'MESSAGE_CREATED');
export const CREATE_MESSAGE_FAILED = helper(NAME, 'CREATE_MESSAGE_FAILED');

