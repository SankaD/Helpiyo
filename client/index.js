import { AppRegistry, YellowBox } from 'react-native';
import App from './App';
// import BackgroundMessaging from './background_messaging';

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
  'AdMob has already been initialized']);

AppRegistry.registerComponent('Helpiyo', () => App);

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => {});
