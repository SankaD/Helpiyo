import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';


const styles = StyleSheet.create({
  activity: {
    marginBottom: 4,
    backgroundColor: commonStyles.colors.color_6,
    padding: 5,
    // justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 48,
    flex: 1,
  },
  activityView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-start',
  },
  activityText: {
    flex: 1,
    padding: 5,
    paddingRight: 10,
    // textAlign: 'left',
  },
  activityTime: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    fontSize: 12,
  },
  icon: {
    padding: 10,
  },
});

export default styles;
