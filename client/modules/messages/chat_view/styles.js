import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  messageList: {
    // flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  chatInputPanel: {
    // height: 48,
    backgroundColor: commonStyles.colors.color_6,
    flexDirection: 'row',
  },
  chatInput: {
    flex: 1,
  },
  sendButton: {
    backgroundColor: commonStyles.colors.label_color,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  sendIcon: {
    color: commonStyles.colors.color_3,
  },
  myMessage: {
    flex: 1,
    padding: 5,
    marginLeft: 20,
    paddingRight: 10,
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: commonStyles.colors.color_4,
    flexDirection: 'row',
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
  },
  yourMessage: {
    flex: 1,
    marginTop: 2,
    marginBottom: 2,
    marginRight: 20,
    paddingLeft: 10,
    padding: 5,
    backgroundColor: commonStyles.colors.label_color,
    flexDirection: 'row',
    borderBottomRightRadius: 40,
    borderTopRightRadius: 40,
  },
  myMessageText: {
    flex: 1,
    textAlign: 'right',
    textAlignVertical: 'center',
    color: commonStyles.colors.color_6,
    paddingRight: 10,
  },
  yourMessageText: {
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'left',
    paddingLeft: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // marginRight: 5,
    // marginLeft: 5,
  },
  myMessageTime: {
    paddingLeft: 10,
    textAlignVertical: 'top',
    fontSize: 10,
    color: commonStyles.colors.color_6,
  },
  yourMessageTime: {
    paddingRight: 10,
    textAlignVertical: 'top',
    fontSize: 10,
  },
});

export default styles;
