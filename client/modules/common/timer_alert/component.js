import React, { Component } from 'react';
import { View, Text, TouchableHighlight, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import TimerMixin from 'react-timer-mixin';
import * as Progress from 'react-native-progress';
import { Answers } from 'react-native-fabric';
import CustomModal from '../custom_modal/component';
import styles from './styles';
import Logger from '../../utils/logger';


export default class TimerAlertComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elapsedTime: 0,
    };
    this.alertTimer = null;
  }

  componentDidMount() {
    Answers.logCustom('load-page', { name: 'timer-modal' });
    if (this.props.timerActive) {
      const method = this.incrementTime.bind(this);
      this.alertTimer = setInterval(() => {
        method();
      }, 100);
      Logger.info('TimerAlert :: timer created for timer alert');
    }
  }
  componentWillUnmount() {
    if (this.props.timerActive) {
      clearInterval(this.alertTimer);
    }
  }
  getTimerText(progress) {
    return `${(this.props.timerInSeconds * progress).toFixed(0)} S`;
  }
  incrementTime() {
    this.setState({
      elapsedTime: this.state.elapsedTime + 0.1,
    });
    if (this.state.elapsedTime >= this.props.timerInSeconds) {
      clearInterval(this.alertTimer);
      Logger.info('TimerAlert :: cleared timer interval');
      this.props.onTimerExpiry();
      this.hideModal();
    }
  }
  onDismiss() {
    clearInterval(this.alertTimer);
    this.props.onDismiss();
  }
  hideModal() {
    clearInterval(this.alertTimer);
    this.props.onDismiss();
  }
  expireTimer() {
    clearInterval(this.alertTimer);
    this.props.onTimerExpiry();
  }
  cancelTimer() {
    this.hideModal();
    this.props.onCancel();
  }
  render() {
    return (
      <CustomModal modalVisible={this.props.modalVisible} hideModal={() => { this.hideModal(); }}>
        <View style={styles.modal}>
          <Text style={styles.title}>Timer Alert</Text>
          <Text style={styles.alertText}>{this.props.alertText}</Text>
          <Progress.Circle
            size={80}
            showsText
            progress={this.state.elapsedTime / this.props.timerInSeconds}
            formatText={progress => this.getTimerText(progress)}
            style={styles.progress}
          />
          <TouchableHighlight style={styles.dismissButton} onPress={() => this.onDismiss()}>
            <Text style={styles.editButtonText}>Edit before sending</Text>
          </TouchableHighlight>
          {/* <TouchableHighlight style={styles.button} onPress={() => this.expireTimer()}> */}
          {/* <Text>Send without editing</Text> */}
          {/* </TouchableHighlight> */}
          <TouchableHighlight style={styles.cancelButton} onPress={() => this.cancelTimer()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableHighlight>
        </View>
      </CustomModal>
    );
  }
}

TimerAlertComponent.propTypes = {
  onTimerExpiry: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  timerInSeconds: PropTypes.number.isRequired,
  alertText: PropTypes.string.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  timerActive: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};
