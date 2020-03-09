import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.emptyPageBackground,
  },
  view: {
    borderColor: commonStyles.colors.light_gray,
    borderWidth: 1,
    marginBottom: 5,
    backgroundColor: commonStyles.colors.color_6,
  },
  list: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
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
  emptyViewContainer: {
    backgroundColor: commonStyles.colors.label_color,
  },
  emptyViewLabel1: {
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    color: '#222',
  },
  emptyViewLabel2: {
    padding: 10,
    textAlign: 'center',
    color: '#555',
  },
  emptyViewButton: {
    // backgroundColor: '#EEF',
    padding: 20,
    borderRadius: 5,
  },
});

export default { ...styles, ...commonStyles };
