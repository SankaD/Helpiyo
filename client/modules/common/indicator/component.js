import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

export default class Indicator extends Component {
  componentDidMount() {
    // Answers.logCustom('load-page', { name: 'loading-indicator' });
  }
  render() {
    if (!this.props.visible) {
      return null;
    }
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" style={styles.indicator} />
      </View>
    );
  }
}

Indicator.propTypes = {
  visible: PropTypes.bool.isRequired,
};
