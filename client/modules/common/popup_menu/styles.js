import { StyleSheet } from 'react-native';
import commonStyles from '../styles';

const styles = StyleSheet.create({
  menu: {
    backgroundColor: commonStyles.colors.color_6,
    borderRadius: 0,
    flex: 1,
  },
  menuItem: {
    padding: 10,
    flex: 1,
    borderWidth: 0.5,
    borderRadius: 0,
    justifyContent: 'center',
    borderColor: commonStyles.colors.light_gray,
    height: 48,
  },
  menuItemText: {
    paddingLeft: 5,
  },
  menuItemTextDisabled: {
    color: commonStyles.colors.gray,
    paddingLeft: 5,
  },
});

export default styles;
