import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: commonStyles.colors.gray,
  },
  list: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_2,
  },
  view: {
    borderColor: commonStyles.colors.light_gray,
    borderWidth: 1,
    marginBottom: 5,
    backgroundColor: commonStyles.colors.color_6,
  },
  buttonPanel: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 5,
  },
  buttonText: {},
  responseButton: {

  },
  commentButton: {},
});

export default { ...styles, ...commonStyles };
