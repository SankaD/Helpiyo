import helper from '../../utils/type_helper';

const NAME = 'VERIFY_PAGE';

export const VERIFY = helper(NAME, 'VERIFY');
export const VERIFIED = helper(NAME, 'VERIFIED');
export const VERIFY_FAILED = helper(NAME, 'VERIFY_FAILED');

export const CREATE_PROFILE = helper(NAME, 'CREATE_PROFILE');
export const PROFILE_CREATED = helper(NAME, 'PROFILE_CREATED');
export const CREATE_PROFILE_FAILED = helper(NAME, 'CREATE_PROFILE_FAILED');
export const LOAD_PROFILE_CREATOR = helper(NAME, 'LOAD_PROFILE_CREATOR');
