import { connect } from 'react-redux';
import * as actions from '../actions';
import { markMessageAsRead } from '../../notifications/actions';

import component from './component';

const mapState = state => ({
  threadId: state.modules.messages.threadId,
  messages: state.modules.messages.messages,
  refreshing: state.modules.messages.refreshingMessages,
  currentProfile: state.modules.global.profile,
  reloadMessages: state.modules.messages.reloadMessages,
});

const mapDispatch = dispatch => ({
  loadMessages: threadId => dispatch(actions.getMessagesForThread(threadId)),
  createMessage: (threadId, content, addedMessage) => dispatch(actions.createMessage(threadId, content, addedMessage)),
  markAsRead: threadId => dispatch(markMessageAsRead(threadId)),
});

export default connect(mapState, mapDispatch)(component);
