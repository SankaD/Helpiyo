import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RequestViewComponent from '../../common/request_view/component';
import RequestPopupMenu from '../request_menu/container';
import styles from './styles';
import commonStyles from '../../common/styles';

export default class RequestComponent extends Component {
    state = {
      menuVisible: false,
    };

    constructor(props) {
      super(props);
      this.showMenu = this.showMenu.bind(this);
      this.hideMenu = this.hideMenu.bind(this);
    }

    static getRequestStatus(request) {
      const icon = request.sos ? commonStyles.icons.sos : commonStyles.icons.request;
      if (request.status === 'active') {
        return {
          color: request.sos ? commonStyles.colors.sosColor : commonStyles.colors.activeElement,
          icon,
        };
      } if (request.status === 'completed') {
        return {
          color: commonStyles.colors.inactiveElement,
          icon,
        };
      }
      return { status: '', color: commonStyles.colors.color_0 };
    }

    renderFirstButton(request) {
      if (request.createdBy === this.props.currentProfileId) {
        return (
          <View style={styles.button}>
            <Icon.Button
              name={commonStyles.icons.responses}
              size={24}
              style={styles.responseButton}
              backgroundColor={styles.colors.color_6}
              color={styles.colors.feed_button_text}
              onPress={() => this.props.showResponses(request._id)}
            />
          </View>
        );
      }
      return (
        <View style={styles.button}>
          <Icon.Button
            name={commonStyles.icons.response}
            size={24}
            style={styles.responseButton}
            backgroundColor={styles.colors.color_6}
            color={request.responseId ? styles.colors.light_gray : styles.colors.feed_button_text}
            disabled={!!request.responseId}
            onPress={() => this.props.acceptRequest(request)}
          />
        </View>
      );
    }

    renderThirdButton(request) {
      if (request.createdBy === this.props.currentProfileId) {
        return (
          <View style={styles.button}>
            <Icon.Button
              name="check"
              size={24}
              style={styles.commentButton}
              backgroundColor="#FFFFFF"
              color={request.status === 'completed' ? styles.colors.light_gray : styles.colors.feed_button_text}
              disabled={request.status === 'completed'}
              onPress={() => this.props.completeRequest(request._id)}
            />
          </View>
        );
      }
      const disabled = this.props.inPromotion.includes(this.props.request._id) || request.status !== 'active';
      return (
        <View style={styles.button}>
          <Icon.Button
            name={request.promoted ? 'heart' : 'heart-outline'}
            size={24}
            style={styles.promoteButton}
            backgroundColor={styles.colors.color_6}
            color={disabled ? styles.colors.light_gray : (request.promoted ? styles.colors.pink : styles.colors.feed_button_text)}
            onPress={() => this.props.promote(request._id)}
            disabled={disabled}
          />
        </View>
      );
    }

    showMenu() {
      console.log('showing menu');
      this.setState({ menuVisible: true });
    }

    hideMenu() {
      console.log('hiding menu');
      this.setState({ menuVisible: false });
    }

    render() {
      const { request } = this.props;
      return (
        <View style={styles.view} key={request._id}>
          <RequestViewComponent
            request={request}
            showMenu={this.showMenu}
            showProfile={this.props.showProfile}
            tagsVisible
            labelVisible
            label={RequestComponent.getRequestStatus(request)}
            currentLocation={this.props.currentLocation}
            showImage={this.props.showImage}
            showElement={this.props.showElement}
          />
          <View style={styles.buttonPanel}>
            {this.renderFirstButton(request)}
            <View style={styles.button}>
              <Icon.Button
                name="comment-outline"
                size={24}
                style={styles.commentButton}
                backgroundColor={styles.colors.color_6}
                color={styles.colors.feed_button_text}
                onPress={() => this.props.showComments(request._id)}
              />
            </View>
            {this.renderThirdButton(request)}
          </View>
          <RequestPopupMenu
            request={request}
            isMyRequest={request.createdBy === this.props.currentProfileId}
            visible={this.state.menuVisible}
            hideMenu={this.hideMenu}
          />
        </View>
      );
    }
}

RequestComponent.propTypes = {
  currentProfileId: PropTypes.string.isRequired,
  request: PropTypes.object.isRequired,
  showProfile: PropTypes.func.isRequired,
  showComments: PropTypes.func.isRequired,
  promote: PropTypes.func.isRequired,
  showResponses: PropTypes.func.isRequired,
  acceptRequest: PropTypes.func.isRequired,
  completeRequest: PropTypes.func.isRequired,
  currentLocation: PropTypes.object,
  inPromotion: PropTypes.array.isRequired,
  showImage: PropTypes.func.isRequired,
  showElement: PropTypes.func.isRequired,
};

RequestComponent.defaultProps = {
  currentLocation: null,
};
