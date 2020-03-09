import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

export default class EmptyView extends Component {
  renderLabel2() {
    if (this.props.label2) {
      return (<Text style={styles.emptyViewLabel2}>{this.props.label2}</Text>);
    }
    return null;
  }
  render() {
    return (
      <TouchableOpacity
        style={styles.emptyViewContainer}
        onPress={() => this.props.onPress()}
        disabled
      >
        <View style={styles.emptyViewButton}>
          <Image source={require('../../../images/empty-image.png')} style={styles.emptyImage} />
          <Text style={styles.emptyViewLabel1}>{this.props.label1}</Text>
          {this.renderLabel2()}
        </View>
      </TouchableOpacity>
    );
  }
}

EmptyView.propTypes = {
  label1: PropTypes.string,
  label2: PropTypes.string,
  onPress: PropTypes.func,
};
EmptyView.defaultProps = {
  label1: '',
  label2: '',
  onPress: () => {},
};
