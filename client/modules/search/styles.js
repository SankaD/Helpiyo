import { StyleSheet } from 'react-native';
import commonStyles from '../common/styles';

const styles = StyleSheet.create({
  frame: {
    position: 'relative',
  },
  container: {
    flex: 1,
    // height: 48,
    backgroundColor: commonStyles.colors.color_1,
  },
  list: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    color: commonStyles.colors.color_6,
  },
  topPanel: {
    flexDirection: 'row',
    backgroundColor: commonStyles.colors.color_2,
    alignItems: 'center',
    // height: 48,
    // justifyContent: 'center',
  },
  searchBar: {
  },
  searchBarContainer: {
    backgroundColor: commonStyles.colors.color_2,
    flex: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    justifyContent: 'center',
    // alignItems:'center'
  },
  icon: {
    // flexGrow: 1,
    // flexDirection: 'row',
    top: 20,
    height: '80%',
    // paddingTop: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#AAA',
  },
  searchBarInput: {
    backgroundColor: commonStyles.colors.color_1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    color: commonStyles.colors.color_6,
    height: 40,
  },
  searchBarInputContainer: {
    backgroundColor: commonStyles.colors.color_4,
    // marginTop: 5,

  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: commonStyles.colors.gray,
  },
  filterToggleOn: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: commonStyles.colors.color_3,
    padding: 10,
  },
  filterToggleOff: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: `${commonStyles.colors.color_3}33`,
    padding: 10,
  },
  filterIcon: {
    color: commonStyles.colors.color_6,
  },
  filterIconOff: {
    color: commonStyles.colors.dark_gray,
  },
});

export default styles;
