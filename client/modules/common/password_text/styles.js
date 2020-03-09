import { StyleSheet } from 'react-native';
import commonStyles from '../styles';

const styles = StyleSheet.create({
  password_field: {
    flexDirection: 'row',
    backgroundColor: commonStyles.colors.color_6,
    borderRadius: 5,
  },
  text: {
    flex: 1,
    color: commonStyles.colors.color_1,
    paddingLeft: 10,
    height: 48,
  },
  icon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordIconVisible: {
    color: commonStyles.colors.color_1,
  },
  passwordIconHidden: {
    color: '#AAA5',
  },
});

export default styles;
