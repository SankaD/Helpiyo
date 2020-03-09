import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  container: {
    backgroundColor: '#CCC1',
    flex: 1,
    padding: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    // padding: 5,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFA',
  },
  icon: {
    height: 120,
    width: 120,
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
  subtitle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    color: commonStyles.colors.color_6,
  },
  submitButton: {
    backgroundColor: commonStyles.colors.ok_button_color,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,

  },
  submitButtonText: {
    color: commonStyles.colors.color_6,
    fontSize: 16,
  },
  text: {
    color: commonStyles.colors.color_1,
    backgroundColor: commonStyles.colors.color_6,
    borderRadius: 5,
    paddingLeft: 10,
    height: 48,
    alignSelf: 'center',
    width: '100%',
  },
  form: {
    flex: 1,
  },
  signInLink: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 15,
    width: '100%',
    backgroundColor: commonStyles.colors.lightTransparentBackground,
    borderRadius: 5,
  },
  signInText: {
    color: commonStyles.colors.color_6,
    padding: 5,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default { ...styles };
