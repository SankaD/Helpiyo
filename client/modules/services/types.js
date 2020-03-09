import helper from '../utils/type_helper';

const NAME = 'services';

export const SHOW_SERVICE_LIST = helper(NAME, 'SHOW_SERVICE_LIST');

export const LOAD_SERVICES = helper(NAME, 'LOAD_SERVICES');
export const SERVICES_LOADED = helper(NAME, 'SERVICES_LOADED');
export const LOAD_SERVICES_FAILED = helper(NAME, 'LOAD_SERVICES_FAILED');

export const SHOW_SERVICE_EDITOR = helper(NAME, 'SHOW_SERVICE_EDITOR');

export const CREATE_SERVICE = helper(NAME, 'CREATE_SERVICE');
export const SERVICE_CREATED = helper(NAME, 'SERVICE_CREATED');
export const CREATE_SERVICE_FAILED = helper(NAME, 'CREATE_SERVICE_FAILED');

export const UPDATE_SERVICE = helper(NAME, 'UPDATE_SERVICE');
export const SERVICE_UPDATED = helper(NAME, 'SERVICE_UPDATED');
export const UPDATE_SERVICE_FAILED = helper(NAME, 'UPDATE_SERVICE_FAILED');

export const TOGGLE_SERVICE = helper(NAME, 'TOGGLE_SERVICE');
export const SERVICE_TOGGLED = helper(NAME, 'SERVICE_TOGGLED');
export const TOGGLE_SERVICE_FAILED = helper(NAME, 'TOGGLE_SERVICE_FAILED');

export const PROMOTE_SERVICE = helper(NAME, 'PROMOTE_SERVICE');
export const SERVICE_PROMOTED = helper(NAME, 'SERVICE_PROMOTED');
export const PROMOTE_SERVICE_FAILED = helper(NAME, 'PROMOTE_SERVICE_FAILED');

export const CHECK_PROMOTED = helper(NAME, 'CHECK_PROMOTED');
export const PROMOTED_CHECKED = helper(NAME, 'PROMOTED_CHECKED');
export const CHECK_PROMOTED_FAILED = helper(NAME, 'CHECK_PROMOTED_FAILED');

export const DELETE_SERVICE = helper(NAME, 'DELETE_SERVICE');
export const SERVICE_DELETED = helper(NAME, 'SERVICE_DELETED');
export const DELETE_SERVICE_FAILED = helper(NAME, 'DELETE_SERVICE_FAILED');

export const SHOW_SERVICE = helper(NAME, 'SHOW_SERVICE');

export const LOAD_SERVICE = helper(NAME, 'LOAD_SERVICE');
export const SERVICE_LOADED = helper(NAME, 'SERVICE_LOADED');
export const LOAD_SERVICE_FAILED = helper(NAME, 'LOAD_SERVICES_FAILED');
