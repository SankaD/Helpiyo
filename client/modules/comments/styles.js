import { StyleSheet } from 'react-native';
import commonStyles from '../common/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentsList: {
    backgroundColor: commonStyles.colors.color_1,
    paddingLeft: 5,
    paddingRight: 5,
  },
  commentInputPanel: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: commonStyles.colors.color_6,
    alignItems: 'center',
  },
  commentButton: {
    flex: 1,
    alignItems: 'center',
  },
  commentTextInput: {
    flex: 10,
    height: 48,
  },
  othersComment: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    flex: 1,
    marginTop: 3,
    marginBottom: 2,
    borderRadius: 5,
  },
  othersText: {
    padding: 5,
    marginLeft: 5,
  },
  othersProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  myComment: {
    backgroundColor: commonStyles.colors.color_6,
    flexDirection: 'row',
    padding: 5,
    marginTop: 3,
    marginBottom: 2,
    marginLeft: 5,
    justifyContent: 'flex-end',
    borderRadius: 5,
  },
  myText: {
    padding: 5,
    textAlign: 'left',
    flexGrow: 1,
    flex: 1,
    flexWrap: 'wrap',
  },
  myProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  icon: {
    color: commonStyles.colors.color_3,
  },
});

export default styles;
