import React, { Component } from 'react';
import { Alert, Linking } from 'react-native';
import PropTypes from 'prop-types';
import Branch from 'react-native-branch';
import Share from 'react-native-share';
import PopupMenu from '../../common/popup_menu/component';
import Logger from '../../utils/logger';
import Toasts from '../../utils/toast';

export default class RequestPopupMenu extends Component {
  showOnMap(request) {
    Logger.debug(request);
    this.loadOnMap(request.location.coordinates[1], request.location.coordinates[0]);
  }

  loadEditRequestPage(requestId) {
    this.props.loadEditRequestPage(requestId);
  }

  deleteRequest(requestId) {
    this.props.deleteRequest(requestId);
  }

  loadReporter(requestId) {
    this.props.loadReporterPage(requestId);
  }

  loadOnMap(latitude, longitude) {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
          return;
        }
        Toasts.error("Can't handle the link");
      })
      .catch((error) => {
        Logger.error(error);
        Toasts.error('Cannot check the link support');
      });
  }

  boostRequest(requestId) {
    Logger.info('showing boost alert');
    Alert.alert('Boosting confirmation', 'Do you want to boost this request (1000 Karma Points spent) ?', [
      {
        text: 'Boost', onPress: () => this.props.boostRequest(requestId),
      }, {
        text: 'Cancel', style: 'cancel', onDismiss: () => {},
      }]);
  }

  showDeleteAlert(requestId) {
    Logger.info('showing deletion alert');
    Alert.alert('Deletion confirmation', 'Do you want to delete this request ?', [
      {
        text: 'Delete', onPress: () => this.deleteRequest(requestId),
      },
      {
        text: 'Cancel', style: 'cancel', onDismiss: () => { },
      },
    ]);
  }

  renderMyRequestMenu() {
    let menuItems = [];
    if (this.props.request.status === 'active') {
      menuItems = [...menuItems, {
        label: 'Share...',
        onPress: () => this.props.shareRequest(this.props.request, this.props.profileId),
      }];
      menuItems = [...menuItems, {
        label: 'Edit Request',
        onPress: () => this.loadEditRequestPage(this.props.request._id),
      }];
      menuItems = [...menuItems, {
        label: 'Delete Request',
        onPress: () => this.showDeleteAlert(this.props.request._id),
      }];
      // menuItems = [...menuItems, {
      //   label: 'Boost Request',
      //   onPress: () => this.boostRequest(this.props.request._id),
      //   disabled: this.props.request.boosted,
      // }];
    }
    if (this.props.request.locationSet) {
      menuItems = [{
        label: 'Open in Google Maps',
        onPress: () => this.showOnMap(this.props.request),
        disabled: !this.props.request.locationSet,
      }, ...menuItems];
    }
    if (menuItems.length === 0) {
      return null;
    }
    return (
      <PopupMenu menuItems={menuItems} visible={this.props.visible} hideMenu={this.props.hideMenu} />
    );
  }

  renderOthersRequestMenu() {
    let menuItems = [{
      label: 'Share...',
      onPress: () => this.props.shareRequest(this.props.request, this.props.profileId),
    }, {
      label: 'Message to Requester',
      onPress: () => this.props.openChatForUser(this.props.request.createdBy),
    }, {
      label: 'Report Request',
      onPress: () => this.loadReporter(this.props.request._id),
    }];
    if (this.props.request.locationSet) {
      menuItems = [{
        label: 'Open in Google Maps',
        onPress: () => this.showOnMap(this.props.request),
        disabled: !this.props.request.locationSet,
      }, ...menuItems];
    }
    if (menuItems.length === 0) {
      return null;
    }
    return (
      <PopupMenu menuItems={menuItems} visible={this.props.visible} hideMenu={this.props.hideMenu} />
    );
  }

  render() {
    if (!this.props.request) {
      return null;
    }
    if (this.props.isMyRequest) {
      return this.renderMyRequestMenu();
    }
    return this.renderOthersRequestMenu();
  }
}

RequestPopupMenu.propTypes = {
  request: PropTypes.object,
  isMyRequest: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  hideMenu: PropTypes.func.isRequired,
  loadEditRequestPage: PropTypes.func.isRequired,
  deleteRequest: PropTypes.func.isRequired,
  loadReporterPage: PropTypes.func.isRequired,
  openChatForUser: PropTypes.func.isRequired,
  boostRequest: PropTypes.func.isRequired,
  profileId: PropTypes.string.isRequired,
  shareRequest: PropTypes.func.isRequired,
};
RequestPopupMenu.defaultProps = {
  request: null,
};
