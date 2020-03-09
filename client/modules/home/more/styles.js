import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
    borderBottomColor: commonStyles.colors.color_2,
    borderBottomWidth: 1,
  },
  menu: {
    // justifyContent: 'flex-end',
    flex: 1,
    // alignItems: 'center',
  },
  menuButton: {
    width: '100%',
    borderWidth: 1,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderColor: commonStyles.colors.color_2,
    backgroundColor: commonStyles.colors.color_3,
  },
  menuItem: {
    flexDirection: 'row',
  },
  icon: {
    paddingRight: 10,
    color: commonStyles.colors.color_6,
  },
  menuItemLabel: {
    color: commonStyles.colors.label_color,
    marginLeft: 5,
  },
});

export default styles;
