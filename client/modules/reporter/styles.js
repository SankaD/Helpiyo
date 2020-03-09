import { StyleSheet } from 'react-native';
import commonStyles from '../common/styles';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: commonStyles.colors.formBackground,
  },
  comment: {
    backgroundColor: commonStyles.colors.color_6,
    borderRadius: 5,
    padding: 5,
    textAlignVertical: 'top',
    height: 120,
  },
  button: {
    height: 48,
    backgroundColor: commonStyles.colors.ok_button_color,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: commonStyles.colors.label_color,
  },
  picker: {
    backgroundColor: commonStyles.colors.color_6,
    // height: 48,
  },
  pickerContainer: {
    marginTop: 10,
    borderRadius: 5,
    // padding: 5,
    // backgroundColor: commonStyles.colors.color_6,
  },
});

export default { ...commonStyles, ...styles };
