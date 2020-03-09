import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
    backgroundColor: commonStyles.colors.color_1,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  listFooter: {
    height: 120,
    backgroundColor: commonStyles.colors.transparent,
  },
});

export default styles;
