import React, { Component } from 'react';
import { View, TouchableHighlight, Text, Platform } from 'react-native';
import PropTypes from 'prop-types';
import CustomModal from '../custom_modal/component';
import menuStyles from './styles';
import Logger from '../../utils/logger';


export default class PopupMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAction: -1,
    };
    this.setCurrentAction = this.setCurrentAction.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setCurrentAction(index) {
    Logger.info(`setting current action index : ${index}`);
    this.setState({ currentAction: index });
    if (Platform.OS === 'android') {
      // since on dismiss is only on IOS
      this.props.menuItems[index].onPress();
    }
  }

  renderMenuItems() {
    return this.props.menuItems.map((menuItem, index) => (
      <TouchableHighlight
        style={menuStyles.menuItem}
        onPress={() => {
          this.setCurrentAction(index);
          this.props.hideMenu();
        }}
        key={menuItem.label}
        disabled={menuItem.disabled}
      >
        <Text style={menuItem.disabled ? menuStyles.menuItemTextDisabled : menuStyles.menuItemText}>{menuItem.label}</Text>
      </TouchableHighlight>
    ));
  }

  onDismiss() {
    Logger.info('popup menu on dismiss');
    if (this.state.currentAction > -1) {
      this.props.menuItems[this.state.currentAction].onPress();
      this.setState({ currentAction: -1 });
    }
  }

  render() {
    return (
      <CustomModal
        modalVisible={this.props.visible}
        onDismiss={this.onDismiss}
        hideModal={() => this.props.hideMenu()}
      >
        <View style={menuStyles.menu}>
          {this.renderMenuItems()}
        </View>
      </CustomModal>
    );
  }
}

PopupMenu.propTypes = {
  menuItems: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
  hideMenu: PropTypes.func.isRequired,
};
