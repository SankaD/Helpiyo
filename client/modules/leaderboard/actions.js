import Logger from '../utils/logger';
import { networkGet } from '../utils/url_helper';
import * as types from './types';
import ProfileHandler from '../common/data_handlers/profile_handler';

export function loadLeaderBoard(offset, name) {
  Logger.info(`loading leaderboard : ${offset} : ${name}`);

  return (dispatch) => {
    dispatch({ type: name === 'global' ? types.LOAD_GLOBAL_LEADERBOARD : types.LOAD_LOCAL_LEADERBOARD, offset });
    networkGet(`profiles/leaderboard/${offset}/${name}`)
      .then(results => results.leaderboard)
      .then((leaderboard) => {
        Logger.info('leaderboard loaded');
        dispatch({
          type: name === 'global' ? types.GLOBAL_LEADERBOARD_LOADED : types.LOCAL_LEADERBOARD_LOADED,
          list: leaderboard,
          offset: offset + leaderboard.length,
          isEnd: leaderboard.length < 100,
        });
      })
      .catch((error) => {
        Logger.error(error);
        dispatch({ type: name === 'global' ? types.LOAD_GLOBAL_LEADERBOARD_FAILED : types.LOAD_LOCAL_LEADERBOARD_FAILED });
      });
  };
}
