import { StyleSheet } from 'react-native';
import commonStyles from '../common/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  emptyViewContainer: {
    backgroundColor: commonStyles.colors.label_color,
  },
  list: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
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
    padding: 20,
    borderRadius: 5,
  },
  notification: {
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    // padding: 10,
  },
  notificationContainer: {
    flexDirection: 'row',
    minHeight: 60,
    padding: 10,
  },
  notificationContent: {
    flex: 1,
    alignSelf: 'center',
    // paddingTop: 20,
  },
  profilePic: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
  notificationTime: {
    fontSize: 10,
    alignSelf: 'flex-start',
    marginTop: 0,
  },
  icon: {
    paddingRight: 10,
    alignSelf: 'center',
  },
});

export default styles;
