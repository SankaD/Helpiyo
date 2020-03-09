import React, { Component } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import { setTestId } from '../../utils/test_helper';

export default class PasswordField extends Component {
  constructor(props) {
    super(props);
    this.state = { showPassword: false };
  }
  toggleSwitch(showPassword) {
    this.setState({ showPassword });
  }
  render() {
    const { showPassword } = this.state;
    return (
      <View style={styles.password_field}>
        <TextInput
          secureTextEntry={!this.state.showPassword}
          style={styles.text}
          defaultValue={this.props.password}
          underlineColorAndroid="transparent"
          placeholder="Password"
          onChangeText={this.props.onChangeText}
          {...setTestId('password_field')}
        />
        <TouchableOpacity style={styles.icon} onPress={() => this.toggleSwitch(!showPassword)}>
          <Icon name="eye" size={32} style={this.state.showPassword ? styles.passwordIconVisible : styles.passwordIconHidden} />
        </TouchableOpacity>
      </View>
    );
  }
}

PasswordField.propTypes = {
  password: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
};

