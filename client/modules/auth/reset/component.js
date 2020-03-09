import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import styles from './styles';
import commonStyles from '../../common/styles';
import ErrorPanel from '../../common/error_panel/component';

export default class PasswordResetPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.view} enabled behaviour="position">
        <LinearGradient
          style={styles.gradient}
          colors={[
                    `${commonStyles.colors.color_1}`,
                    `${commonStyles.colors.color_2}`,
                ]}
        >
          <View style={styles.container}>
            <Image source={require('../../../images/Icon_blue_512.png')} style={styles.icon} />
            <Text style={styles.title}>HELPIYO</Text>

            <Text style={styles.subtitle}>Reset Password</Text>
            <View style={styles.form}>
              <ErrorPanel testId="email error" errorMessage={this.props.emailError}>
                <TextInput
                  placeholder="Email"
                  underlineColorAndroid="transparent"
                  style={styles.text}
                  keyboardType="email-address"
                  onChangeText={(text) => { this.setState({ email: text }); }}
                />
              </ErrorPanel>

              <TouchableHighlight
                style={styles.submitButton}
                onPress={() => { this.props.resetPassword(this.state.email); }}
              >
                <Text style={styles.submitButtonText}>Send recovery email</Text>
              </TouchableHighlight>
            </View>
            <TouchableOpacity
              style={styles.signInLink}
              onPress={this.props.goToSignIn}
            >
              <Text style={styles.signInText}>Already have an account? Sign In
                      here!
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }
}

PasswordResetPage.propTypes = {
  emailError: PropTypes.string,
  resetPassword: PropTypes.func.isRequired,
  goToSignIn: PropTypes.func.isRequired,
};

PasswordResetPage.defaultProps = {
  emailError: '',
};
