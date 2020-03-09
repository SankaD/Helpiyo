import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './action_button.styles';
import commonStyles from '../styles';

export default class ActionButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ActionButton
        buttonColor="rgba(231,76,60,1)"
        offsetY={20}
        offsetX={20}
        hideShadow={false}
        fixNativeFeedbackRadius
      >
        <ActionButton.Item
          title="New Service"
          buttonColor="#9b59b6"
          onPress={this.props.openServiceCreator}
        >
          <Icon name="briefcase-check" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        {/* <ActionButton.Item */}
        {/* title="New Message" */}
        {/* buttonColor="#9b59b6" */}
        {/* onPress={() => { */}
        {/* this.props.showMessageComposer.bind(this); */}
        {/* }} */}
        {/* > */}
        {/* <Icon name="message-text" style={styles.actionButtonIcon} /> */}
        {/* </ActionButton.Item> */}
        <ActionButton.Item
          title="Ask for help"
          buttonColor="#003459"
          onPress={this.props.openRequestCreator}
        >
          <Icon name={commonStyles.icons.request} style={styles.actionButtonIcon} />
        </ActionButton.Item>

        <ActionButton.Item
          title="Send SOS (Emergency)"
          buttonColor="#EE0000"
          onPress={this.props.openSosCreator}
        >
          <Icon name="alarm-light" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    );
  }
}

ActionButtons.propTypes = {
  openRequestCreator: PropTypes.func.isRequired,
  openSosCreator: PropTypes.func.isRequired,
  openServiceCreator: PropTypes.func.isRequired,
};
