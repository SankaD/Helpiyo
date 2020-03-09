import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsList from 'react-native-settings-list';
import PropTypes from 'prop-types';
import commonStyles from '../common/styles';
import { Answers } from 'react-native-fabric';

export default class SettingsPage extends Component {
    static navigationOptions = {
      title: 'Settings',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
    };
    componentDidMount() {
      Answers.logCustom('load-page', { name: 'settings' });
    }
    render() {
      return (
        <View>
          <SettingsList>
            <SettingsList.Item title="General" onPress={() => this.props.showGeneralSettings()} />
            <SettingsList.Item title="Account" onPress={() => this.props.showAccountSettings()} />
            <SettingsList.Item title="Privacy" onPress={() => this.props.showPrivacySettings()} />
            <SettingsList.Item title="About" onPress={() => this.props.showAboutSettings()} />
          </SettingsList>
        </View>
      );
    }
}

SettingsPage.propTypes = {
  showGeneralSettings: PropTypes.func.isRequired,
  showAccountSettings: PropTypes.func.isRequired,
  showPrivacySettings: PropTypes.func.isRequired,
  showAboutSettings: PropTypes.func.isRequired,
};
