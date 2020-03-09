import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  settingsList: {

  },
  modal: {
    backgroundColor: commonStyles.colors.formBackground,
    borderRadius: 10,
    padding: 10,
  },
  headerText: {
    fontSize: 16,
    flex: 1,
    backgroundColor: commonStyles.colors.transparent,
    margin: 10,
  },
  label: {
    fontWeight: 'bold',
    color: commonStyles.colors.label_color,
    marginBottom: 10,
    fontSize: 16,
  },
  submitButton: {
    borderStyle: 'solid',
    borderRadius: 5,
    backgroundColor: commonStyles.colors.ok_button_color,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    fontWeight: 'bold',
    color: commonStyles.colors.label_color,
  },
  textInput: {
    backgroundColor: commonStyles.colors.color_6,
    marginBottom: 2,
    padding: 5,
    borderRadius: 5,
    height: 120,
    textAlignVertical: 'top',

  },

});

export default styles;
