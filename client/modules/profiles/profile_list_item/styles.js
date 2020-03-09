import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_6,
    flexDirection: 'row',
    padding: 5,
    // justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: commonStyles.colors.color_3,
    borderBottomWidth: 1,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  middlePanel: {
    // padding: 5,
    // marginLeft: 5,
    // flex: 1,
  },
  heroName: {
    fontWeight: '400',
    fontSize: 16,
  },
  ratingPanel: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },
  ratingIcon: {
    paddingRight: 5,
    color: commonStyles.colors.color_3,
  },
  ratingText: {
  },
});

export default styles;
