import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  list: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  topPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // padding: 5,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: commonStyles.colors.color_2,
  },
  bottomPanel: {
    backgroundColor: commonStyles.colors.color_6,
    flex: 1,
  },
  profilePic: {
    width: 80,
    height: 80,
    margin: 10,
    borderRadius: 40,
  },
  profileDetails: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 5,
    padding: 5,
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
  },
  classText: {
    fontSize: 26,
    margin: 10,
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
    color: commonStyles.colors.ratingLabel,
    backgroundColor: commonStyles.colors.lightTransparentBackground,
  },
  ratingText: {
    fontSize: 26,
    margin: 10,
    padding: 5,
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
    borderRadius: 5,
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
  },
  menuPanel1: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  moreMenuButton1: {
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 0,
    padding: 5,
    backgroundColor: '#EEE7',
    // borderRadius: 2,
  },
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

export default styles;
