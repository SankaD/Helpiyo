import React, { Component } from 'react';
import {
  View, Text, FlatList, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import { Answers } from 'react-native-fabric';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import commonStyles from '../common/styles';
import EmptyView from '../common/empty_view/component';

export default class CommentView extends Component {
    static navigationOptions = {
      title: 'Comments',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };

    state = {
      currentComment: null,
    };

    constructor(props) {
      super(props);
      this.createComment = this.createComment.bind(this);
    }

    componentDidMount() {
      this.props.loadComments(this.props.targetId, this.props.targetType);
      Answers.logCustom('load-page', { name: 'comments-page' });
    }

    static renderOthersComment(comment) {
      return (
        <View style={styles.othersComment}>
          <Image
            style={styles.othersProfilePic}
            source={{ uri: comment.item.creator.profilePic }}
          />
          <Text style={styles.othersText}>{comment.item.comment}</Text>
        </View>
      );
    }

    static renderEmptyView() {
      return (
        <EmptyView
          label1="There are no comments here yet."
          label2="Be the first to comment"
        />
      );
    }

    static renderMyComment(comment) {
      return (
        <View style={styles.myComment}>
          <Text style={styles.myText}>{comment.item.comment}</Text>
          <Image
            style={styles.myProfilePic}
            source={{ uri: comment.item.creator.profilePic }}
          />
        </View>
      );
    }

    createComment() {
      const comment = {
        targetType: this.props.targetType,
        targetId: this.props.targetId,
        comment: this.state.currentComment,
        commentType: 'text',
      };
      const addedComment = {
        targetType: this.props.targetType,
        targetId: this.props.targetId,
        comment: this.state.currentComment,
        commentType: 'text',
        createdBy: this.props.currentProfile._id,
        creator: this.props.currentProfile,
        createdOn: new Date().toISOString(),
        _id: `${Date.now()}`,
      };
      this.props.createComment(comment, addedComment);
      this.setState({ currentComment: '' });
    }

    renderComment(comment) {
      if (this.props.currentProfile._id === comment.item.createdBy) {
        return CommentView.renderMyComment(comment);
      }

      return CommentView.renderOthersComment(comment);
    }

    changeText(text) {
      this.setState({ currentComment: text });
    }

    componentDidUpdate() {
      if (this.props.refreshList) {
        this.props.loadComments(this.props.targetId, this.props.targetType);
      }
    }

    render() {
      return (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={this.props.comments}
            renderItem={comment => this.renderComment(comment)}
            keyExtractor={comment => comment._id}
            refreshing={this.props.refreshing}
            onRefresh={() => this.props.loadComments(this.props.targetId, this.props.targetType)}
            style={styles.commentsList}
            contentContainerStyle={[{ flexGrow: 1 }, this.props.comments.length ? null : { justifyContent: 'center' }]}
            ListEmptyComponent={CommentView.renderEmptyView()}
          />
          <KeyboardAvoidingView
            enabled
            behavior={(Platform.OS === 'ios') ? 'padding' : null}
            style={styles.commentInputPanel}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <TextInput
              style={styles.commentTextInput}
              multiline
              underlineColorAndroid="transparent"
              defaultValue={this.state.currentComment}
              onChangeText={text => this.changeText(text)}
              maxlength={1000}
            />
            <TouchableOpacity
              style={styles.commentButton}
              onPress={this.createComment}
            >
              <Icon name="send" size={24} style={styles.icon} />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }
}

CommentView.propTypes = {
  loadComments: PropTypes.func.isRequired,
  createComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  refreshing: PropTypes.bool.isRequired,
  targetId: PropTypes.string.isRequired,
  targetType: PropTypes.string.isRequired,
  currentProfile: PropTypes.object.isRequired,
  refreshList: PropTypes.bool.isRequired,
};
