import { StyleSheet } from 'react-native';
import commonStyles from '../styles';

const styles = StyleSheet.create({
  frame: {
    // position: 'relative',
    // flex: 1,
    // height: 60,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: commonStyles.colors.color_2,
    borderBottomColor: commonStyles.colors.color_2,
    borderBottomWidth: 1,
  },
  searchBarContainer: {
    backgroundColor: commonStyles.colors.color_2,
    flex: 1,
    flexDirection: 'row',
    marginTop: -1,
    marginBottom: -1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // height: 40,
  },
  searchBarInput: {
    backgroundColor: commonStyles.colors.color_1,
    padding: 2,
    paddingLeft: 5,
    color: '#FFF',
    borderRadius: 5,
    flex: 1,
    height: 44,
  },
  logo: {
    width: 48,
    height: 48,
    marginLeft: 5,
    marginRight: 5,
  },
  icon: {
    color: '#FFF',
    paddingRight: 10,
    paddingLeft: 10,
  },
  activeIcon: {
    color: commonStyles.colors.yellow,
    paddingRight: 10,
    paddingLeft: 10,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
  },
  searchIconButton: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 48,
    height: 48,
    flex: 1,
  },
  title: {
    flex: 1,
    padding: 14.5,
  },
  titleText: {
    color: commonStyles.colors.label_color,
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    // paddingLeft: 10,
    flex: 1,
  },
  resultsContainer: {
    // flex: 1,
    // backgroundColor: '#AAA',
  },
  resultList: {
    zIndex: 2,
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
    flexGrow: 1,
    flex: 1,
  },
  elementList: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#AAA',
    backgroundColor: '#FFF',
  },
  resultsBackground: {
    height: 600,
    backgroundColor: '#AAAA',
  },
  resultHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noResultText: {
    fontWeight: '400',
  },
  searchResultItem: {
    padding: 5,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // borderBottomColor: commonStyles.colors.darkTransparentBackground,
    // borderBottomWidth: 1,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 0,
    marginRight: 5,
    // alignSelf: 'flex-start',
  },
  notificationCount: {
    // position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    color: commonStyles.colors.label_color,
    backgroundColor: commonStyles.colors.transparent,
    borderRadius: 4,
    padding: 2,
    fontSize: 10,
  },
  notificationComposite: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  post: {
    alignSelf: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
  },
});

export default styles;
