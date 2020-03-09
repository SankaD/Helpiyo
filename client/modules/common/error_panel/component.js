import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import * as utils from '../../utils/test_helper';

export default class ErrorPanel extends Component {
  renderError() {
    if (this.props.errorMessage && this.props.errorMessage !== '') {
      return (
        <Text style={styles.message} {...utils.setTestId(this.props.testId)}>
          {this.props.errorMessage}
        </Text>
      );
    }
    return <View />;
  }

  render() {
    if (!this.props.errorMessage) {
      return (
        <View style={styles.panel}>
          <View>
            {this.props.children}
          </View>
        </View>
      );
    }
    if (this.props.messageUnderView) {
      return (
        <View style={styles.panel}>
          <View style={styles.errorDownView}>
            {this.props.children}
          </View>
          {this.renderError()}
        </View>
      );
    }

    return (
      <View style={styles.panel}>
        {this.renderError()}
        <View style={styles.errorUpView}>
          {this.props.children}
        </View>
      </View>
    );
  }
}
ErrorPanel.propTypes = {
  errorMessage: PropTypes.string,
  testId: PropTypes.string.isRequired,
  messageUnderView: PropTypes.bool,
  children: PropTypes.object, // eslint-disable-line react/forbid-prop-types,react/require-default-props
};
ErrorPanel.defaultProps = {
  errorMessage: '',
  messageUnderView: true,
};

