import { StyleSheet } from 'react-native';
import commonStyles from '../common/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  list: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  element: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: commonStyles.colors.color_6,
    marginBottom: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingRight: 10,
    paddingLeft: 10,
  },
  myElement: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFF',
    marginBottom: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingRight: 10,
    paddingLeft: 10,
  },
  tabPane: {
    backgroundColor: '#AAE',
    flex: 1,
  },
  profilePic: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 20,
  },
  heroName: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    // marginLeft: 5,
  },
  points: {
    color: commonStyles.colors.color_4,
  },
  rank: {
    width: 50,
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    color: commonStyles.colors.color_1,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  panel1: {
    flexDirection: 'row',
    flex: 1,
  },
  panel2: {
    flexDirection: 'column',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
  },
});

export default styles;
