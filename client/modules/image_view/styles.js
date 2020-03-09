import { StyleSheet } from 'react-native';
import commonStyles from '../common/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  gallery: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default { ...styles, ...commonStyles };
