import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: commonStyles.colors.color_2,
    flex: 1,
  },
  topPanel: {
    // flex: 1,
    backgroundColor: commonStyles.colors.color_3,
    flexDirection: 'row',
    padding: 10,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 5,
  },
  bottomPanel: {
    flex: 1,
  },
  label: {
    color: commonStyles.colors.color_6,
    fontWeight: 'bold',
    fontSize: 16,
  },
  karmaPoints: {
    fontSize: 16,
    color: commonStyles.colors.color_6,
    textAlign: 'right',
    flex: 1,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  element: {
    flexDirection: 'row',
    backgroundColor: commonStyles.colors.color_6,
    padding: 10,
    marginBottom: 1,
  },
  positiveValue: {
    marginRight: 10,
    flex: 1,
    color: commonStyles.colors.green,
  },
  negativeValue: {
    marginRight: 10,
    flex: 1,
    color: commonStyles.colors.red,
  },
  time: {
    textAlign: 'right',
  },
});

export default styles;
