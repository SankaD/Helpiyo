import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Answers } from 'react-native-fabric';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import styles from './styles';
import commonStyles from '../../common/styles';
import ErrorPanel from '../../common/error_panel/component';


export default class VerifyPageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heroName: this.props.heroName,
    };
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.signOut();
          },
        },
      ],
    );
  }

  componentDidMount() {
    Answers.logCustom('load-page', { name: 'verify-page' });
  }

  render() {
    return (
      <LinearGradient
        style={styles.gradient}
        colors={[
          `${commonStyles.colors.color_1}`,
          `${commonStyles.colors.color_2}`]}
      >
        <SafeAreaView style={styles.container}>
          <Image source={require('../../../images/Icon_blue_512.png')} style={styles.icon} />
          <Text style={styles.title}>HELPIYO</Text>
          <View style={styles.form}>
            <ErrorPanel testId="hero error" errorMessage={this.props.heroNameError}>
              <TextInput
                placeholder="Display name"
                underlineColorAndroid="transparent"
                style={styles.text}
                onChangeText={text => this.setState({ heroName: text })}
                height={48}
                editable={!this.props.submitting}
              />
            </ErrorPanel>
            <TouchableHighlight
              style={styles.submitButton}
              onPress={() => { this.props.createProfile(this.props.email, this.state.heroName, this.props.id); }}
              underlayColor="#EEE"
              disabled={this.props.submitting}
            >
              <Text style={styles.submitButtonText}>Create profile</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.signoutButton}
              onPress={() => this.signOut()}
              underlayColor="#EEE"
              disabled={this.props.submitting}
            >
              <Text style={styles.submitButtonText}>Sign Out</Text>
            </TouchableHighlight>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

VerifyPageComponent.propTypes = {
  email: PropTypes.string.isRequired,
  heroNameError: PropTypes.string,
  heroName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  createProfile: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  signOut: PropTypes.func.isRequired,
};
VerifyPageComponent.defaultProps = {
  heroNameError: '',
};
