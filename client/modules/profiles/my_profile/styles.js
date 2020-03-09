import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  topPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // padding: 5,
    // borderRadius: 5,
    alignItems: 'center',
    backgroundColor: commonStyles.colors.color_1,
  },
  list: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  bottomPanel: {
    margin: 5,
    backgroundColor: commonStyles.colors.color_2,
    flex: 1,
  },
  profilePic: {
    width: 80,
    height: 80,
    // margin: 10,
    padding: 20,
    borderRadius: 40,
  },
  profileDetails: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 5,
    padding: 5,
    // backgroundColor: '#AAA6',
  },
  profilePicButton: {
    borderRadius: 40,
    borderWidth: 2,
    borderColor: commonStyles.colors.color_2,
  },
  profilePicIcon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor: commonStyles.colors.color_1,
    borderRadius: 20,
    padding: 4,
    paddingLeft: 6,
    borderWidth: 1,
    borderColor: commonStyles.colors.color_2,
  },
  buttonPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: commonStyles.colors.color_2,
    marginTop: 5,
    paddingRight: 10,
    paddingLeft: 10,
    marginBottom: 5,
    height: 48,
  },
  button: {
    // margin: 10,
  },
  classText: {
    fontSize: 26,
    margin: 10,
    padding: 5,
    borderRadius: 5,
    // flex: 1,
    alignSelf: 'flex-start',
    color: commonStyles.colors.ratingLabel,
    backgroundColor: commonStyles.colors.lightTransparentBackground,
  },
  ratingText: {
    fontSize: 26,
    margin: 10,
    padding: 5,
    // flex: 1,
    borderRadius: 5,
    alignSelf: 'flex-start',
    textAlign: 'right',
    color: commonStyles.colors.ratingLabel,
    backgroundColor: commonStyles.colors.lightTransparentBackground,
  },
  mainPanel: {
    backgroundColor: commonStyles.colors.lightTransparentBackground,
    // margin: 5,
    marginBottom: 0,
    paddingBottom: 0,
    // borderRadius: 5,
  },
  displayName: {
    fontWeight: 'bold',
    fontSize: 24,
    margin: 5,
    color: commonStyles.colors.color_3,
    textAlign: 'center',
    alignSelf: 'center',
  },
  location: {
    margin: 5,
  },

  loadupScreen: {
    // alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadupScreenText: {
    color: '#000',
  },
  activity: {
    marginBottom: 4,
    backgroundColor: commonStyles.colors.color_6,
    padding: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    minHeight: 48,
  },
  activityView: {
    flex: 1,
    flexDirection: 'row',
  },
  activityText: {
    flex: 1,
    padding: 5,
    paddingRight: 10,
  },
  activityTime: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    // backgroundColor: commonStyles.colors.color_2,

  },
  emptyViewContainer: {
    backgroundColor: commonStyles.colors.emptyPageBackground,
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
  displayNameModalContainer: {
    backgroundColor: commonStyles.colors.light_gray,
    borderRadius: 5,
    padding: 10,
  },
  displayNameModalHeader: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  displayNameInput: {
    backgroundColor: commonStyles.colors.label_color,
    borderRadius: 5,
    height: 48,
  },
  displayNameSubmitButton: {
    backgroundColor: commonStyles.colors.ok_button_color,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  displayNameSubmitButtonDisabled: {
    backgroundColor: commonStyles.colors.ok_button_color,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  displayNameSubmitLabel: {
    color: commonStyles.colors.label_color,
    fontWeight: 'bold',
  },
});

export default styles;
