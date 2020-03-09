import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import PropTypes from 'prop-types';
import { Answers } from 'react-native-fabric';
import styles from './styles';

export default class IntroPage extends Component {
  componentDidMount() {
    Answers.logCustom('load-page', { name: 'intro-page' });
  }

  componentWillUnmount() {
  }

  renderButtons() {
    return (
      <TouchableOpacity style={styles.signinButton} onPress={() => { this.props.gotoSignIn(); }}>
        <Text style={styles.signinButtonText}>Sign In</Text>
      </TouchableOpacity>
    );
  }

  renderAppName() {
    return (
      <View style={styles.appNamePanel}>
        <Image source={require('../../images/Icon_blue_512.png')} resizeMode="contain" style={styles.appIcon} />
        <Text style={styles.appName}>Helpiyo</Text>
      </View>
    );
  }

  renderText(mainText, subText) {
    return (
      <View style={styles.bottomPanel}>
        <View style={styles.textPanel}>
          <Text style={styles.mainText}>{mainText}</Text>
          <Text style={styles.subText}>{subText}</Text>
        </View>
        {this.renderButtons()}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Swiper
          showsButtons
          loop={false}
          removeClippedSubviews={false}
          style={styles.swiper}
          dot={<View style={styles.dot} />}
          activeDot={(
            <View
              style={styles.activeDot}
            />
)}
          nextButton={<Text style={styles.sliderButton}>›</Text>}
          prevButton={<Text style={styles.sliderButton}>‹</Text>}
        >
          <ImageBackground
            style={styles.slide}
            source={require('../../images/intro/1.jpg')}
            resizeMode="cover"
            resizeMethod="resize"
          >
            {this.renderAppName()}
            {this.renderText('Ask help from others', 'Request help and receive from our community')}
          </ImageBackground>
          <ImageBackground
            style={styles.slide}
            source={require('../../images/intro/2.jpg')}
            resizeMode="cover"
            resizeMethod="resize"
          >
            {this.renderAppName()}
            {this.renderText('Help others', 'Respond to requests and help others')}
          </ImageBackground>
          <ImageBackground
            style={styles.slide}
            source={require('../../images/intro/3.jpg')}
            resizeMode="cover"
            resizeMethod="resize"
          >
            {this.renderAppName()}
            {this.renderText('Earn points', 'Earn points and spend them for your requests')}
          </ImageBackground>
          <ImageBackground
            style={styles.slide}
            source={require('../../images/intro/4.jpg')}
            resizeMode="cover"
            resizeMethod="resize"
          >
            {this.renderAppName()}
            {this.renderText('Be a hero', 'Progress through leaderboard and be known as a hero')}
          </ImageBackground>
          <ImageBackground
            style={styles.slide}
            source={require('../../images/intro/5.jpg')}
            resizeMode="cover"
            resizeMethod="resize"
          >
            {this.renderAppName()}
            {this.renderText('Invite friends', "Don't forget to invite your friends. We need to grow together as a community")}
          </ImageBackground>
        </Swiper>
      </View>
    );
  }
}

IntroPage.propTypes = {
  // gotoInvites: PropTypes.func.isRequired,
  gotoSignIn: PropTypes.func.isRequired,
  // setIntroduced: PropTypes.func.isRequired,
};
