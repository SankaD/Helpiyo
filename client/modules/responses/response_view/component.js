import React, { Component } from 'react';
import { Alert, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RequestViewComponent from '../../common/request_view/component';
import ResponsePopupMenu from '../response_menu/container';
import styles from './styles';
import Logger from '../../utils/logger';
import commonStyles from '../../common/styles';

export default class ResponseComponent extends Component {
    state = {
      menuVisible: false,
    };
    constructor(props) {
      super(props);
      this.showMenu = this.showMenu.bind(this);
      this.hideMenu = this.hideMenu.bind(this);
    }
    static getResponseStatus(response) {
      const icon = commonStyles.icons.response;
      if (response.status === 'active') {
        return { status: 'Open', color: commonStyles.colors.activeElement, icon };
      } else if (response.status === 'accepted') {
        return { status: 'Accepted', color: commonStyles.colors.ongoingElement, icon };
      } else if (response.status === 'rejected') {
        return { status: 'Rejected', color: commonStyles.colors.rejectedElement, icon };
      } else if (response.status === 'completed') {
        return { status: 'Completed', color: commonStyles.colors.inactiveElement, icon };
      }
      return { status: '', color: commonStyles.colors.color_0 };
    }
    acceptResponse(responseId) {
      Alert.alert('Confirm acceptance', 'Do you want to accept this response ?', [
        {
          text: 'Accept', onPress: () => this.props.acceptResponse(responseId),
        },
        {
          text: 'Cancel', style: 'cancel', onDismiss: () => { },
        },
      ]);
    }
    rejectResponse(responseId) {
      Alert.alert('Confirm rejection', 'Do you want to reject this response ?', [
        {
          text: 'Reject', onPress: () => this.props.rejectResponse(responseId),
        },
        {
          text: 'Cancel', style: 'cancel', onDismiss: () => { },
        },
      ]);
    }
    completeResponse(responseId) {
      Alert.alert('Confirm completion', 'Do you want to complete this response ?', [
        {
          text: 'Complete', onPress: () => this.props.completeResponse(responseId),
        },
        {
          text: 'Cancel', style: 'cancel', onDismiss: () => { },
        },
      ]);
    }
    renderFirstButton(response) {
      if (response.createdBy === this.props.currentProfileId) {
        return (
          <Icon.Button
            name={commonStyles.icons.request}
            size={24}
            style={styles.responseButton}
            backgroundColor={styles.colors.color_6}
            color={styles.colors.feed_button_text}
            onPress={() => this.props.showRequest(response.requestId)}
          >
            {/* Show Request */}
          </Icon.Button>
        );
      }
      if (response.status === 'active' || response.status === 'rejected') {
        return (
          <Icon.Button
            name="thumb-up"
            size={24}
            style={styles.responseButton}
            backgroundColor={styles.colors.color_6}
            color={styles.colors.feed_button_text}
            onPress={() => this.acceptResponse(response._id)}
          >
            {/* Accept */}
          </Icon.Button>
        );
      }
      if (response.status === 'accepted') {
        return (
          <Icon.Button
            name="thumb-down"
            size={24}
            style={styles.responseButton}
            backgroundColor={styles.colors.color_6}
            color={styles.colors.feed_button_text}
            onPress={() => this.rejectResponse(response._id)}
          >
            {/* Reject */}
          </Icon.Button>
        );
      }
      return (
        <Icon.Button
          name="thumb-up"
          size={24}
          style={styles.responseButton}
          backgroundColor={styles.colors.color_6}
          color={styles.colors.light_gray}
          disabled
          onPress={() => this.acceptResponse(response._id)}
        >
          {/* Accept */}
        </Icon.Button>
      );
    }
    renderThirdButton(response) {
      if (response.createdBy === this.props.currentProfileId) {
        return (
          <Icon.Button
            name="check"
            size={24}
            style={styles.commentButton}
            backgroundColor="#FFFFFF"
            color={response.status !== 'accepted' ? styles.colors.light_gray : styles.colors.feed_button_text}
            disabled={response.status !== 'accepted'}
            onPress={() => this.completeResponse(response._id)}
          >
            {/* Complete */}
          </Icon.Button>
        );
      }

      return null;
    }
    showDeleteAlert() {
      Logger.info('showing deletion alert');
      Alert.alert('Confirm deletion', 'Do you want to delete this response ?', [
        {
          text: 'Delete', onPress: () => this.deleteResponse(this.state.currentResponseId),
        },
        {
          text: 'Cancel', style: 'cancel', onDismiss: () => { this.setState({ isShowingMenu: false }); },
        },
      ]);
    }

    showMenu() {
      this.setState({ menuVisible: true });
    }
    hideMenu() {
      this.setState({ menuVisible: false });
    }
    render() {
      const { response, showImage, showElement } = this.props;
      return (
        <View style={styles.view} key={response._id}>
          <RequestViewComponent
            request={response}
            showMenu={this.showMenu}
            showProfile={this.props.showProfile}
            tagsVisible
            labelVisible
            label={ResponseComponent.getResponseStatus(response)}
            showImage={showImage}
            showElement={showElement}
            currentLocation={this.props.currentLocation}
          />
          <View style={styles.buttonPanel}>
            {this.renderFirstButton(response)}
            <Icon.Button
              name="comment-outline"
              size={24}
              style={styles.commentButton}
              backgroundColor={styles.colors.color_6}
              color={styles.colors.feed_button_text}
              onPress={() => this.props.showComments(response._id)}
            >
              {/* Comment */}
            </Icon.Button>
            {this.renderThirdButton(response)}
          </View>
          <ResponsePopupMenu
            response={response}
            isMyResponse={response.createdBy === this.props.currentProfileId}
            visible={this.state.menuVisible}
            hideMenu={this.hideMenu}
          />
        </View>
      );
    }
}

ResponseComponent.propTypes = {
  currentProfileId: PropTypes.string.isRequired,
  response: PropTypes.object.isRequired,
  showProfile: PropTypes.func.isRequired,
  showComments: PropTypes.func.isRequired,
  showRequest: PropTypes.func.isRequired,
  acceptResponse: PropTypes.func.isRequired,
  rejectResponse: PropTypes.func.isRequired,
  completeResponse: PropTypes.func.isRequired,
  showImage: PropTypes.func.isRequired,
  showElement: PropTypes.func.isRequired,
  currentLocation: PropTypes.object.isRequired,
};
