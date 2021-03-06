import { StyleSheet, Platform } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  view: {
    backgroundColor: commonStyles.colors.color_1,
    flex: 1,
  },
  container: {
    backgroundColor: commonStyles.colors.color_1,
    flex: 1,
    padding: 20,
  },
  gradient: {
    flex: 1,
  },
  form: {
    // flex: 1,
    marginTop: 20,
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
  submitButton: {
    backgroundColor: commonStyles.colors.ok_button_color,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: commonStyles.colors.color_6,
    fontSize: 16,
  },
  googleSignIn: {
    marginTop: 20,
    height: 48,
    backgroundColor: '#FFF', // '#4285F4',
    alignItems: 'center',
    margin: 5,
  },
  googleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: commonStyles.colors.color_6,
    margin: 2,
  },
  googleIcon: {
    // backgroundColor: commonStyles.colors.color_6,
    width: 24,
    height: 24,
  },
  googleSignInText: {
    color: '#555', // commonStyles.colors.color_6,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'left',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
  },
  facebookSignIn: {
    marginTop: 20,
    height: 48,
    backgroundColor: '#3B5998',
    alignItems: 'center',
    margin: 5,
  },
  facebookSignInText: {
    color: commonStyles.colors.color_6,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: Platform.OS === 'ios' ? 'left' : 'left',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
  },
  facebookContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  facebookIconContainer: {
    width: 46,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B5998',
  },
  facebookIcon: {
    color: '#FFF',
    marginRight: 5,
    marginBottom: -1,
  },
  text: {
    color: commonStyles.colors.color_1,
    backgroundColor: commonStyles.colors.color_6,
    borderRadius: 5,
    paddingLeft: 10,
    height: 48,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 5,
  },

  signupLink: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 20,
    width: '100%',
    backgroundColor: commonStyles.colors.darkTransparentBackground,
    borderRadius: 5,
  },
  signupText: {
    color: commonStyles.colors.color_6,
    padding: 5,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetLink: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    backgroundColor: commonStyles.colors.darkTransparentBackground,
    borderRadius: 5,
  },
  resetText: {
    color: commonStyles.colors.color_6,
    padding: 5,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separatorText: {
    color: commonStyles.colors.label_color,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 20,
  },
});

export default { ...styles };
