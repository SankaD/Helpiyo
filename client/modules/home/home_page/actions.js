import branch from 'react-native-branch';
import { showRequest } from '../../requests/actions';
import { networkGet, networkPost } from '../../utils/url_helper';
import { showService } from '../../services/actions';
import Logger from '../../utils/logger';
import * as globalTypes from '../../global/types';
import * as globalActions from '../../global/actions';

export function subscribeToBranch() {
  return (dispatch) => {
    branch.subscribe(({ error, params }) => {
      if (error) {
        Logger.info('branch error : ');
        Logger.error(error);
      }
      Logger.info('link params');
      Logger.info(params);
      if (params.itemCategory === 'request' && !!params.requestId) {
        dispatch({ type: globalTypes.LAUNCHED_FROM_LINK });
        dispatch(showRequest(params.requestId));
        networkPost('common/add-points-for-share', JSON.stringify({
          elementType: 'request',
          elementId: params.requestId,
          profileId: params.referrer,
        }));
      } else if (params.itemCategory === 'service' && !!params.serviceId) {
        dispatch({ type: globalTypes.LAUNCHED_FROM_LINK });
        dispatch(showService(params.serviceId));
        networkPost('common/add-points-for-share', JSON.stringify({
          elementType: 'service',
          elementId: params.serviceId,
          profileId: params.referrer,
        }));
      }
    });
  };
}

