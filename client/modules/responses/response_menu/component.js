import React, { Component } from 'react';
import { Alert, Linking } from 'react-native';
import PropTypes from 'prop-types';
import PopupMenu from '../../common/popup_menu/component';
import Logger from '../../utils/logger';
import Toasts from '../../utils/toast';

export default class ResponsePopupMenu extends Component {
  showOnMap(response) {
    this.loadOnMap(response.location.coordinates[1], response.location.coordinates[0]);
  }
  showDeleteAlert(responseId) {
    Logger.info('showing deletion alert');
    Alert.alert('Deletion confirmation', 'Do you want to delete this response ?', [
      {
        text: 'Delete', onPress: () => this.deleteResponse(responseId),
      },
      {
        text: 'Cancel', style: 'cancel', onDismiss: () => { this.setState({}); },
      },
    ]);
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
  loadEditResponsePage(responseId) {
    this.props.loadEditResponsePage(responseId);
  }
  deleteResponse(responseId) {
    this.props.deleteResponse(responseId);
  }
  loadReporter(responseId) {
    this.props.loadReporterPage(responseId);
  }
  renderMyResponseMenu() {
    let menuItems = [];
    if (this.props.response.status === 'active') {
      menuItems = [...menuItems, {
        label: 'Edit Response',
        onPress: () => this.loadEditResponsePage(this.props.response._id),
      }];
      menuItems = [...menuItems, {
        label: 'Delete Response',
        onPress: () => this.showDeleteAlert(this.props.response._id),
      }];
    }
    if (this.props.response.locationSet) {
      menuItems = [{
        label: 'Open in Google Maps',
        onPress: () => this.showOnMap(this.props.response),
        disabled: !this.props.response.locationSet,
      }, ...menuItems];
    }
    if (menuItems.length === 0) {
      return null;
    }
    return (
      <PopupMenu menuItems={menuItems} visible={this.props.visible} hideMenu={this.props.hideMenu} />
    );
  }
  renderOthersResponseMenu() {
    let menuItems = [{
      label: 'Message to Responder',
      onPress: () => this.props.openChatForUser(this.props.response.createdBy),
    }, {
      label: 'Report Response',
      onPress: () => this.loadReporter(this.props.response._id),
    }];
    if (this.props.response.locationName) {
      menuItems = [{
        label: 'Open in Google Maps',
        onPress: () => this.showOnMap(this.props.response._id),
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
    if (!this.props.response) {
      return null;
    }
    if (this.props.isMyResponse) {
      return this.renderMyResponseMenu();
    }
    return this.renderOthersResponseMenu();
  }
}

ResponsePopupMenu.propTypes = {
  response: PropTypes.object,
  isMyResponse: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  hideMenu: PropTypes.func.isRequired,
  loadEditResponsePage: PropTypes.func.isRequired,
  deleteResponse: PropTypes.func.isRequired,
  openChatForUser: PropTypes.func.isRequired,
  loadReporterPage: PropTypes.func.isRequired,
};
ResponsePopupMenu.defaultProps = {
  response: null,
};
