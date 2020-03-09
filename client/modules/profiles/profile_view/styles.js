import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_2,
    // borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: commonStyles.colors.color_0,
    padding: 10,
  },
  topPanel: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 5,
    alignItems: 'flex-start',
    backgroundColor: commonStyles.colors.transparent,
  },
  middlePanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    paddingTop: 0,
  },
  menuIcon: {

  },
  leftColumn: {
    // flex: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    width: '20%',
  },
  middleColumn: {
    flex: 1,
    // flexGrow: 1,
  },
  rightColumn: {
    // flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    width: '20%',
  },
  followerButton: {
    alignItems: 'center',
    flex: 1,
  },
  followerLabel: {
    color: commonStyles.colors.label_color,
    fontSize: 12,
  },
  followerCount: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: commonStyles.colors.label_color,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profilePicButton: {
    borderRadius: 80,
    borderWidth: 4,
    borderColor: commonStyles.colors.color_6,
    margin: 5,
    alignSelf: 'center',
  },
  profilePicIconContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    backgroundColor: commonStyles.colors.color_0,
    borderRadius: 10,
    // width: 20,
    // height: 20,
    borderWidth: 1,
    borderColor: commonStyles.colors.color_6,
  },
  profilePicIcon: {
    flex: 1,
    padding: 4,
    flexGrow: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainPanel: {
    backgroundColor: commonStyles.colors.lightTransparentBackground,
    // margin: 5,
    // marginBottom: 0,
    // paddingBottom: 0,
    borderRadius: 5,
  },
  displayName: {
    fontWeight: 'bold',
    fontSize: 20,
    margin: 5,
    color: commonStyles.colors.label_color,
    textAlign: 'center',
    alignSelf: 'center',
  },
  rankView: {
    flex: 1,
    alignItems: 'center',
  },
  rankLabel: {
    color: commonStyles.colors.label_color,
    fontSize: 12,
  },
  rankValue: {
    color: commonStyles.colors.label_color,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ratingView: {
    flex: 1,
    alignItems: 'center',
  },
  ratingLabel: {
    color: commonStyles.colors.label_color,
    fontSize: 12,
    textAlign: 'center',
  },
  ratingValue: {
    color: commonStyles.colors.label_color,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  classView: {
    flex: 1,
    alignItems: 'center',
  },
  classLabel: {
    color: commonStyles.colors.label_color,
    fontSize: 12,
  },
  classValue: {
    color: commonStyles.colors.label_color,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heroNamePanel: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 5,
    marginTop: 5,
  },
  heroNameIcon: {
    justifyContent: 'flex-end',
  },
});

export default styles;
