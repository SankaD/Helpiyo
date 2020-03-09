import { StyleSheet } from 'react-native';
import commonStyles from '../styles';

const styles = StyleSheet.create({
  view: {
    marginBottom: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
    borderBottomColor: commonStyles.colors.light_gray,
    backgroundColor: commonStyles.colors.color_6,
    borderBottomWidth: 1,
  },
  topPanel: {
    flexDirection: 'row',
    paddingBottom: 5,
    justifyContent: 'space-between',
  },
  profileData: {
    flexDirection: 'row',
  },
  profilePic: {
    width: 40,
    height: 40,
    marginRight: 10,
    // borderRadius: 20,
  },
  heroName: {
    fontSize: 14,
    color: commonStyles.colors.dark_gray,
    fontWeight: 'bold',
    flex: 1,
  },
  createdOn: {
    fontSize: 12,
  },
  postPanel: {
    marginTop: 2,
    marginBottom: 2,
    minHeight: 30,
    flex: 1,
    flexDirection: 'row',
  },
  post: {
    alignSelf: 'flex-start',
    // paddingLeft: 5,
    // paddingRight: 5,
  },
  paymentPanel: {
    marginTop: 5,
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 5,
  },
  points: {
    color: commonStyles.colors.color_1,
    fontSize: 14,
    marginBottom: 5,
  },
  currency: {
    color: commonStyles.colors.color_1,
    fontSize: 14,
    textAlign: 'right',
    // marginBottom: 5,
    // fontWeight: 'bold',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  imagePanel: {
    borderRadius: 10,
    backgroundColor: commonStyles.colors.lightTransparentBackground,
    paddingBottom: 5,
    paddingTop: 5,
    marginTop: 5,
    height: 200,
    alignItems: 'center',
  },
  timePanel: {
    flexDirection: 'column',
    flex: 1,
    marginTop: 5,
    // minHeight: 48,
  },
  fromTime: {
    // fontWeight: 'bold',
    color: commonStyles.colors.color_1,
    fontSize: 14,
  },
  toTime: {
  },
  locationPanel: {
    // marginBottom: 5,
    paddingTop: 5,
    flexDirection: 'row',
  },
  metaRightPanel: {
    // alignSelf: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  locationText: {
    fontWeight: '100',
    color: commonStyles.colors.color_4,
  },
  locationIcon: {
    color: commonStyles.colors.color_4,
  },
  menuPanel: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    flex: 1,
  },
  moreMenuButton: {
    marginLeft: 8,
    marginRight: 4,
  },
  sosIcon: {
    color: commonStyles.colors.sosColor,
    marginRight: 3,
  },
  carousel: {
    backgroundColor: '#AAAAAA',
    alignItems: 'center',
    alignSelf: 'center',
  },
  image: {
    height: 200,
    width: 200,
    alignSelf: 'center',
  },
  imageView: {
    alignSelf: 'center',
  },
  label: {
    paddingRight: 5,
    // marginTop: 5,
    marginRight: 5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tagPanel: {
    marginTop: 5,
    flexDirection: 'row',
  },
  tag: {
    marginLeft: 0,
    marginRight: 5,
    backgroundColor: `${commonStyles.colors.color_4}33`,
    borderRadius: 5,
    alignItems: 'center',
    padding: 5,
    justifyContent: 'center',
    height: 24,
  },
  tagView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10,
  },
  tagLabel: {
    color: commonStyles.colors.color_3,
  },
  statusPanel: {
    flexDirection: 'row',
  },
  descPanel: {
    flexDirection: 'column',
    marginTop: 0,
  },
});

export default { ...styles, ...commonStyles };
