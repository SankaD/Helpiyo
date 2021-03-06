import helper from '../utils/type_helper';

const NAME = 'leaderboard';

export const LOAD_GLOBAL_LEADERBOARD = helper(NAME, 'LOAD_GLOBAL_LEADERBOARD');
export const GLOBAL_LEADERBOARD_LOADED = helper(NAME, 'GLOBAL_LEADERBOARD_LOADED');
export const LOAD_GLOBAL_LEADERBOARD_FAILED = helper(NAME, 'LOAD_GLOBAL_LEADERBOARD_FAILED');

export const LOAD_LOCAL_LEADERBOARD = helper(NAME, 'LOAD_LOCAL_LEADERBOARD');
export const LOCAL_LEADERBOARD_LOADED = helper(NAME, 'LOCAL_LEADERBOARD_LOADED');
export const LOAD_LOCAL_LEADERBOARD_FAILED = helper(NAME, 'LOAD_LOCAL_LEADERBOARD_FAILED');
