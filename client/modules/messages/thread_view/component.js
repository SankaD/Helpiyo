import React, { Component } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Answers } from 'react-native-fabric';
import styles from './styles';
import commonStyles from '../../common/styles';
import EmptyView from '../../common/empty_view/component';


export default class ThreadView extends Component {
    static navigationOptions = {
      title: 'Chats',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };

    componentDidMount() {
      this.props.loadThreads();
      Answers.logCustom('load-page', { name: 'message-threads-page' });
    }

    openThread(threadId) {
      this.props.openThread(threadId);
      // this.props.markAsRead(threadId);
    }

    renderThreadElement(thread) {
      return (
        <TouchableOpacity style={styles.threadView} onPress={() => this.openThread(thread._id)}>
          <Image
            style={styles.profilePic}
            source={{ uri: thread.participants.filter(p => p._id !== this.props.currentProfileId)[0].profilePic }}
          />
          <View style={styles.threadContent}>
            <View style={styles.threadHeader}>
              <Text style={styles.threadName}>{thread.name ? thread.name : thread.participants.filter(part => this.props.currentProfileId !== part._id)[0].heroName}</Text>
              <View style={styles.moreButton}>
                <Text style={styles.timeLabel}>{moment(thread.modifiedOn).local().fromNow()}</Text>
              </View>
            </View>
            <Text style={styles.threadMessage}>{thread.lastMessage}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    static renderEmptyView() {
      return (
        <EmptyView
          label1={"You don't have any active chats."}
          label2="Connect with others via their profile"
        />
      );
    }

    render() {
      return (
        <SafeAreaView style={styles.container}>
          <FlatList
            style={styles.threadList}
            data={this.props.threads}
            renderItem={({ item }) => this.renderThreadElement(item)}
            keyExtractor={(item, index) => item._id}
            refreshing={this.props.refreshing}
            onRefresh={this.props.loadThreads}
            contentContainerStyle={[{ flexGrow: 1 }, this.props.threads.length ? null : { justifyContent: 'center' }]}
            ListEmptyComponent={ThreadView.renderEmptyView()}
          />
        </SafeAreaView>
      );
    }
}
ThreadView.propTypes = {
  openThread: PropTypes.func.isRequired,
  threads: PropTypes.array.isRequired,
  refreshing: PropTypes.bool.isRequired,
  loadThreads: PropTypes.func.isRequired,
  currentProfileId: PropTypes.string.isRequired,
};
