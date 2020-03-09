import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableHighlight,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import styles from './styles';
import commonStyles from '../../common/styles';
import ErrorPanel from '../../common/error_panel/component';
import { setTestId } from '../../utils/test_helper';
import Logger from '../../utils/logger';
import { Answers } from 'react-native-fabric';

export default class SignUpComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      heroName: '',
      phoneNumber: '',
    };
  }
  componentDidMount() {
    Answers.logCustom('load-page', { name: 'sign-up-page' });
  }

  submit() {
    Logger.info('submitting...');
    this.props.signUp(this.state.email, this.state.phoneNumber, this.state.heroName, this.state.password);
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.view} enabled behaviour="position">
        <LinearGradient
          style={styles.gradient}
          colors={[
          `${commonStyles.colors.color_1}`,
          `${commonStyles.colors.color_2}`]}
        >
          <View style={styles.container}>
            <Image source={require('../../../images/Icon_blue_512.png')} style={styles.icon} />
            <Text style={styles.title}>HELPIYO</Text>

            <Text style={styles.subtitle}>Create new account</Text>
            <View style={styles.form}>
              <ErrorPanel testId="email error" errorMessage={this.props.emailError}>
                <TextInput
                  placeholder="Email"
                  {...setTestId('email')}
                  underlineColorAndroid="transparent"
                  style={styles.text}
                  onChangeText={text => this.setState({ email: text })}
                  keyboardType="email-address"
                />
              </ErrorPanel>

              <TouchableHighlight
                style={styles.submitButton}
                {...setTestId('submit')}
                onPress={() => this.submit()}
                disabled={this.props.submitting}
              >
                <Text style={styles.submitButtonText}>Sign Up</Text>
              </TouchableHighlight>
              <TouchableOpacity
                style={styles.signInLink}
                onPress={() => { this.props.goToSignIn(); }}
              >
                <Text style={styles.signInText}>Already have an account? Sign In
                        here!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }
}

SignUpComponent.propTypes = {
  goToSignIn: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  emailError: PropTypes.string,
  phoneNumberError: PropTypes.string,
  heroNameError: PropTypes.string,
  passwordError: PropTypes.string,
  submitting: PropTypes.bool,
};
SignUpComponent.defaultProps = {
  emailError: '',
  phoneNumberError: '',
  heroNameError: '',
  passwordError: '',
  submitting: false,
};
