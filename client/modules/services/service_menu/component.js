import React, { Component } from 'react';
import { Alert, Linking } from 'react-native';
import PropTypes from 'prop-types';
import Share from 'react-native-share';
import Branch from 'react-native-branch';
import PopupMenu from '../../common/popup_menu/component';
import Logger from '../../utils/logger';
import Toasts from '../../utils/toast';

export default class ServicePopupMenu extends Component {
  showOnMap(service) {
    Logger.debug(service);
    this.loadOnMap(service.location.coordinates[1], service.location.coordinates[0]);
  }

  loadEditServicePage(serviceId) {
    this.props.loadEditServicePage(serviceId);
  }

  deleteService(serviceId) {
    this.props.deleteService(serviceId);
  }

  loadReporter(serviceId) {
    this.props.loadReporterPage(serviceId);
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

  showDeleteAlert(serviceId) {
    Logger.info('showing deletion alert');
    Alert.alert('Deletion confirmation', 'Do you want to delete this service ?', [
      {
        text: 'Delete', onPress: () => this.deleteService(serviceId),
      },
      {
        text: 'Cancel', style: 'cancel', onDismiss: () => { },
      },
    ]);
  }

  renderMyServiceMenu() {
    let menuItems = [];
    if (this.props.service.status === 'active') {
      menuItems = [...menuItems, {
        label: 'Share...',
        onPress: () => this.props.shareService(this.props.service, this.props.profileId),
      }];
      menuItems = [...menuItems, {
        label: 'Edit Service',
        onPress: () => this.loadEditServicePage(this.props.service),
      }];
      menuItems = [...menuItems, {
        label: 'Delete Service',
        onPress: () => this.showDeleteAlert(this.props.service._id),
      }];
    }
    if (this.props.service.locationSet) {
      menuItems = [{
        label: 'Open in Google Maps',
        onPress: () => this.showOnMap(this.props.service),
        disabled: !this.props.service.locationSet,
      }, ...menuItems];
    }
    if (menuItems.length === 0) {
      return null;
    }
    return (
      <PopupMenu menuItems={menuItems} visible={this.props.visible} hideMenu={this.props.hideMenu} />
    );
  }

  renderOthersServiceMenu() {
    let menuItems = [{
      label: 'Share...',
      onPress: () => this.props.shareService(this.props.service, this.props.profileId),
    }, {
      label: 'Report Service',
      onPress: () => this.loadReporter(this.props.service._id),
    }];
    if (this.props.service.locationSet) {
      menuItems = [{
        label: 'Open in Google Maps',
        onPress: () => this.showOnMap(this.props.service),
        disabled: !this.props.service.locationSet,
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
    if (!this.props.service) {
      return null;
    }
    if (this.props.isMyService) {
      return this.renderMyServiceMenu();
    }
    return this.renderOthersServiceMenu();
  }
}

ServicePopupMenu.propTypes = {
  service: PropTypes.object.isRequired,
  isMyService: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  hideMenu: PropTypes.func.isRequired,
  loadEditServicePage: PropTypes.func.isRequired,
  deleteService: PropTypes.func.isRequired,
  loadReporterPage: PropTypes.func.isRequired,
  profileId: PropTypes.string.isRequired,
  shareService: PropTypes.func.isRequired,
};
