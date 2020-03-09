import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  container: {
    backgroundColor: commonStyles.colors.color_1,
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
  },
  icon: {
    height: 80,
    width: 80,
    alignSelf: 'center',
    padding: 5,
  },
  title: {
    fontSize: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    color: commonStyles.colors.color_6,
    // fontFamily: 'Open Sans',
    fontWeight: 'bold',
  },
});

export default { ...styles };
