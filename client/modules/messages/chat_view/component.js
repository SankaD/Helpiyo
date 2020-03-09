import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Keyboard, View, Text, TextInput, FlatList, Image, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Answers } from 'react-native-fabric';
import commonStyles from '../../common/styles';
import styles from './styles';
import EmptyView from '../../common/empty_view/component';

export default class ChatView extends Component {
    static navigationOptions = {
      title: 'Messages',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };

    state = {
      text: '',
    };

    constructor(props) {
      super(props);
      this.onSend = this.onSend.bind(this);
    }

    componentDidMount() {
      this.props.loadMessages(this.props.threadId);
      this.props.markAsRead(this.props.threadId);
      Answers.logCustom('load-page', { name: 'messages-page' });
    }

    componentWillUnmount() {
      this.props.markAsRead(this.props.threadId);
    }

    componentDidUpdate() {
      if (this.props.reloadMessages) {
        this.props.loadMessages(this.props.threadId);
      }
    }

    onSend() {
      if (!this.state.text) {
        return;
      }
      const addedMessage = {
        threadId: this.props.threadId,
        text: this.state.text,
        creator: this.props.currentProfile,
        createdBy: this.props.currentProfile._id,
        createdOn: new Date().toISOString(),
        _id: `${Date.now()}`,
      };
      this.props.createMessage(this.props.threadId, this.state.text, addedMessage);
      this.setState({ text: '' });
      Keyboard.dismiss();
    }

    onChangeText(text) {
      this.setState({ text });
    }

    static renderEmptyView() {
      return (
        <EmptyView
          label1={"You don't have any messages in this thread."}
        />
      );
    }

    renderMessage(message) {
      if (message.createdBy === this.props.currentProfile._id) {
        return (
          <View style={styles.myMessage}>
            <Text style={styles.myMessageTime}>{moment(message.createdOn).local().fromNow()}</Text>
            <Text style={styles.myMessageText}>{message.text}</Text>
            <Image source={{ uri: message.creator.profilePic }} style={styles.profilePic} />
          </View>
        );
      }
      return (
        <View style={styles.yourMessage}>
          <Image source={{ uri: message.creator.profilePic }} style={styles.profilePic} />
          <Text style={styles.yourMessageText}>{message.text}</Text>
          <Text style={styles.yourMessageTime}>{moment(message.createdOn).local().fromNow()}</Text>
        </View>
      );
    }

    render() {
      return (
        <SafeAreaView style={styles.container}>
          <FlatList
            style={styles.messageList}
            data={this.props.messages}
            renderItem={({ item }) => this.renderMessage(item)}
            keyExtractor={(item, index) => item._id}
            refreshing={this.props.refreshing}
            onRefresh={() => this.props.loadMessages(this.props.threadId)}
            contentContainerStyle={[{ flexGrow: 1 }, this.props.messages.length ? null : { justifyContent: 'center' }]}
            ListEmptyComponent={ChatView.renderEmptyView()}
          />
          <KeyboardAvoidingView
            enabled
            style={styles.chatInputPanel}
            behavior={(Platform.OS === 'ios') ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <TextInput
              style={styles.chatInput}
              onChangeText={text => this.onChangeText(text)}
              defaultValue={this.state.text}
            />
            <TouchableOpacity style={styles.sendButton} onPress={this.onSend}>
              <Icon name="send" size={24} style={styles.sendIcon} />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }
}

ChatView.propTypes = {
  threadId: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  loadMessages: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  createMessage: PropTypes.func.isRequired,
  currentProfile: PropTypes.object.isRequired,
  reloadMessages: PropTypes.bool.isRequired,
  markAsRead: PropTypes.func.isRequired,
};
