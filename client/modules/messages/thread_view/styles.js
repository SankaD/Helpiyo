import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  threadList: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  threadView: {
    backgroundColor: commonStyles.colors.color_6,
    marginTop: 2,
    marginBottom: 2,
    flexDirection: 'row',
    flex: 1,
    height: 56,
    // padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
  },
  threadHeader: {
    flexDirection: 'row',
    flex: 1,
  },
  threadContent: {
    alignItems: 'flex-end',
    padding: 5,
    flex: 1,
  },
  profilePic: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    borderRadius: 20,
    marginRight: 10,
  },
  threadName: {
    fontWeight: 'bold',
    flex: 1,
  },
  moreMenuIcon: {
    marginLeft: 4,
  },
  moreButton: {
    marginLeft: 4,
    marginRight: 4,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  threadMessage: {
    flex: 1,
  },
});

export default styles;
