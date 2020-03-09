import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Modal, TouchableOpacity, TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import styles from './styles';

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _hideModal=this.props.hideModal.bind(this);

  render() {
    return (
      <Modal
        animationType="fade"
        transparent
        visible={this.props.modalVisible}
        onRequestClose={this._hideModal}
        onDismiss={this.props.onDismiss}
      >
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            activeOpacity={1}
            onPressOut={this._hideModal}
            style={styles.touchableCancel}
          >
            <ScrollView directionalLockEnabled style={styles.scrollView}>
              <TouchableWithoutFeedback style={styles.panel2}>
                <View style={styles.modal}>
                  {this.props.children}
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  }
}

CustomModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  onDismiss: PropTypes.func,
};

CustomModal.defaultProps = {
  onDismiss: () => {},
};
