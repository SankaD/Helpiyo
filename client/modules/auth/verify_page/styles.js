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
    // justifyContent: 'space-between',
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
  submitButton: {
    backgroundColor: commonStyles.colors.ok_button_color,
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: commonStyles.colors.color_6,
    fontSize: 16,
  },
  signoutButton: {
    backgroundColor: commonStyles.colors.color_4,
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
  form: {
    flex: 1,
  },
  // gradient: {
  //   flex: 1,
  //   justifyContent: 'space-between',
  //   padding: 5,
  // },
  // title: {
  //   fontSize: 20,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   alignSelf: 'center',
  //   color: commonStyles.colors.color_6,
  // },
  // submitButton: {
  //   backgroundColor: commonStyles.colors.ok_button_color,
  //   padding: 10,
  //   borderRadius: 10,
  //   alignItems: 'center',
  //   margin: 10,
  // },
  // submitButtonText: {
  //   color: commonStyles.colors.color_6,
  //   fontSize: 16,
  // },
  // text: {
  //   color: commonStyles.colors.color_6,
  //   backgroundColor: commonStyles.colors.lightTransparentBackground,
  //   borderRadius: 5,
  //   padding: 10,
  //   alignSelf: 'center',
  //   // flex: 1,
  //   justifyContent: 'center',
  // },
  // form: {
  //   justifyContent: 'space-between',
  //   flex: 1,
  // },
  // signOutButton: {
  //   backgroundColor: commonStyles.colors.color_1,
  //   padding: 10,
  //   borderRadius: 10,
  //   alignItems: 'center',
  //   margin: 10,
  // },
  // signOutButtonText: {
  //   color: commonStyles.colors.color_6,
  //   fontSize: 16,
  // },
});

export default { ...styles };
