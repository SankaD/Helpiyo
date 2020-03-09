import { StyleSheet } from 'react-native';
import commonStyles from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(40,40,40,0.6)',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#FFF',
    margin: 10,
    padding: 5,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#aaa',
  },
  title: {
    alignSelf: 'center',
    padding: 10,
    fontSize: 16,
  },
  alertText: {
    alignSelf: 'center',
    padding: 5,
  },
  progress: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
    margin: 10,
  },
  button: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#eee',
    backgroundColor: commonStyles.colors.ok_button_color,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  dismissButton: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#eee',
    backgroundColor: commonStyles.colors.ok_button_color,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  cancelButton: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#eee',
    backgroundColor: commonStyles.colors.error_color,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  editButtonText: {
    color: commonStyles.colors.label_color,
  },
  cancelButtonText: {
    color: commonStyles.colors.label_color,
  },
});

export default { ...styles };
