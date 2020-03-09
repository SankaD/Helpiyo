import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#6ac',
    backgroundColor: commonStyles.colors.emptyPageBackground,
    flex: 1,
    // margin: 20,
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default { ...styles };
