import { connect } from 'react-redux';
import TitleBar from './title_bar.component';
import * as actions from './title_bar.actions';
import { showProfile } from '../../profiles/actions';
import { showRequest } from '../../requests/actions';

const mapState = state => ({
  searchResults: state.modules.home.titleBar.searchResults,
  searchInProgress: state.modules.home.titleBar.searchInProgress,
  lastSearchedOn: state.modules.home.titleBar.lastSearchedOn,
  searchString: state.modules.home.titleBar.searchString,
  notificationCount: state.modules.home.titleBar.unreadNotificationCount,
  messageCount: state.modules.home.titleBar.unreadMessageNotificationCount,
  notifications: state.modules.home.titleBar.notifications,
});
const mapDispatch = dispatch => ({
  // showMenu: showMenu1 => dispatch(actions.showMenu(showMenu1)),
  // search: (searchString, searchType) => dispatch(actions.search(searchString, searchType)),
  loadSearch: () => dispatch(actions.openSearchView()),
  discardSearchResults: () => dispatch(actions.discardSearchResults()),
  showProfile: profileId => dispatch(showProfile(profileId)),
  showRequest: requestId => dispatch(showRequest(requestId)),
  openNotifications: () => dispatch(actions.showNotifications()),
  openMessages: () => dispatch(actions.showMessages()),
  loadNotificationCount: () => dispatch(actions.getNotificationCount()),
  loadMessageCount: () => dispatch(actions.getMessageCount()),
});

export default connect(mapState, mapDispatch)(TitleBar);
