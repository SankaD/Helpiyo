import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    borderColor: commonStyles.colors.light_gray,
    borderWidth: 1,
    marginBottom: 3,
    marginTop: 2,
    backgroundColor: commonStyles.colors.color_6,
  },
  buttonPanel: {
    marginTop: 0,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 5,
    alignItems: 'center',
  },
  responseButton: {
    flex: 1,
  },
  commentButton: {
    flex: 1,
  },
});

export default { ...styles, ...commonStyles };
