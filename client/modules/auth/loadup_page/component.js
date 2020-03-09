import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';
import commonStyles from '../../common/styles';
import styles from '../sign_in_page/styles';

export default class LoadupPage extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <LinearGradient
        style={styles.gradient}
        colors={[
          `${commonStyles.colors.color_1}`,
          `${commonStyles.colors.color_2}`,
        ]}
      >
        <SafeAreaView style={styles.container}>
          <Image source={require('../../../images/Icon_blue_512.png')} style={styles.icon} />
          <Text style={styles.title}>HELPIYO</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}
