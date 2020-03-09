import React, { Component } from 'react';
import {
  View,
  Text,
    TextInput,
  KeyboardAvoidingView,
  Image,
  TouchableHighlight,
} from 'react-native';
import { GoogleSigninButton } from 'react-native-google-signin';
import { Answers } from 'react-native-fabric';
import { SafeAreaView } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import commonStyles from '../../common/styles';
import ErrorPanel from '../../common/error_panel/component';

import Indicator from '../../common/indicator/component';

export default class SignInPageComponent extends Component {
  componentDidMount() {
    Answers.logCustom('load-page', { name: 'sign-in-page' });
  }

  render() {
    return (
      <SafeAreaView style={styles.view} enabled behaviour="padding" keyboardVerticalOffset={-500}>
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
            <ErrorPanel testId="formError" errorMessage={this.props.miscError} />
            <View style={styles.form}>
              <TouchableHighlight onPress={this.props.signInWithGoogle} style={styles.googleSignIn} underlayColor="#EEE">
                <View style={styles.googleContainer}>
                  <View style={styles.googleIconContainer}>
                    <Image
                      source={require('../../../images/google-logo.png')}
                      style={styles.googleIcon}
                    />
                  </View>
                  <Text style={styles.googleSignInText}>Sign in with Google</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={this.props.signInWithFacebook} style={styles.facebookSignIn} underlayColor="#3B5998">
                <View style={styles.facebookContainer}>
                  <View style={styles.facebookIconContainer}>
                    <Icon name="facebook" size={30} style={styles.facebookIcon} />
                  </View>
                  <Text style={styles.facebookSignInText}>Login with Facebook</Text>
                </View>
              </TouchableHighlight>
            </View>
            <Indicator visible={this.props.submitting} />
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }
}

SignInPageComponent.propTypes = {
  miscError: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
  signInWithGoogle: PropTypes.func.isRequired,
  signInWithFacebook: PropTypes.func.isRequired,
};

SignInPageComponent.defaultProps = {
  miscError: '',
};
