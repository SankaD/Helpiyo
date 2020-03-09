import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.emptyPageBackground,
  },
  list: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  view: {
    borderColor: commonStyles.colors.light_gray,
    borderWidth: 1,
    marginBottom: 5,
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
  },
  buttonText: {},
  responseButton: {
    flex: 1,
  },
  commentButton: {

  },
  promoteButton: {},
  emptyViewContainer: {
    alignSelf: 'stretch',
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
    padding: 20,
    borderRadius: 5,
    flex: 1,
  },
  listFooter: {
    height: 120,
    backgroundColor: commonStyles.colors.transparent,
  },
});

export default { ...styles, ...commonStyles };
