import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  menu: {
    backgroundColor: commonStyles.colors.color_6,
    justifyContent: 'center',
    margin: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    height: 48,
  },
  menuItem: {
    padding: 10,
    flex: 1,
    borderWidth: 0.5,
    justifyContent: 'center',
    borderColor: 'transparent',
  },
  menuItemText: {
  },
});

export default styles;
