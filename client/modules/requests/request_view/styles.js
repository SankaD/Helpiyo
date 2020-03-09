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
    flex: 1,
    alignItems: 'center',
  },
  responseButton: {
    // flex: 1,
    // width: '100%',
    // fontWeight: 'normal',
  },
  commentButton: {
    // flex: 1,
    // width: '33%',
  },
  promoteButton: {
    // flex: 1,
    // width: '33%',
  },
});

export default { ...styles, ...commonStyles };
