import { NavigationActions } from 'react-navigation';
import * as types from './types';

export function showImage(images, index) {
  return (dispatch) => {
    dispatch({ type: types.SHOW_IMAGE, images, imageIndex: index });
    dispatch(NavigationActions.navigate({ routeName: 'ImageView', key: 'ImageView' }));
  };
}
