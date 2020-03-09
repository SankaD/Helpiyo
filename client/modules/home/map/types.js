import helper from '../../utils/type_helper';

const NAME = 'FEED';

export const GET_NEARBY_REQUESTS = helper(NAME, 'GET_NEARBY_REQUESTS');
export const NEARBY_REQUESTS_RECEIVED = helper(NAME, 'NEARBY_REQUESTS_RECEIVED');
export const GET_NEARBY_REQUESTS_FAILED = helper(NAME, 'GET_NEARBY_REQUESTS_FAILED');
