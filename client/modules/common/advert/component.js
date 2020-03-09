import React, { Component } from 'react';
import { View } from 'react-native';
import firebase from 'react-native-firebase';
import styles from './styles';

const { Banner, AdRequest } = firebase.admob;
const request = new AdRequest().addTestDevice().build();
// request.addKeyword('foobar');

export default class AdvertComponent extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.advert}>
          <Banner
            size="SMART_BANNER"
            request={request}
            // onAdLoaded={() => {}}
            // unitId="ca-app-pub-3940256099942544/6300978111" // test account
            unitId={__DEV__ ? 'ca-app-pub-3940256099942544/6300978111' : 'ca-app-pub-1442642171879157/1503480440'} // real account
          />
        </View>
      </View>
    );
  }
}
