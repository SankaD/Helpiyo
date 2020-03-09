import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import SettingsList from 'react-native-settings-list';
import commonStyles from '../../common/styles';

export default class PrivacySettingsPage extends Component {
    static navigationOptions = {
      title: 'Settings',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
    };
    constructor(props) {
      super(props);
      this.state = {
        currentPage: 'main',
      };
    }

    renderGeneralSettings() {
      return (
        <View>
          <SettingsList>
            <SettingsList.Header headerText="SOS timer period (s)" />
            <TextInput defaultValue="10" />
            {/* <SettingsList.Header headerText="Alert Sound" /> */}
          </SettingsList>
        </View>
      );
    }
    renderAccountSettings() {}
    renderPrivacySettings() {}
    renderAboutSettings() {}
    render() {
      if (this.state.currentPage === 'general') {
        return this.renderGeneralSettings();
      } else if (this.state.currentPage === 'account') {
        return this.renderAccountSettings();
      } else if (this.state.currentPage === 'privacy') {
        return this.renderPrivacySettings();
      } else if (this.state.currentPage === 'about') {
        return this.renderAboutSettings();
      }
      return (
        <View>
          <SettingsList>
            <SettingsList.Item title="General" onPress={() => this.setState({ currentPage: 'general' })} />
            <SettingsList.Item title="Account" onPress={() => this.setState({ currentPage: 'account' })} />
            <SettingsList.Item title="Privacy" onPress={() => this.setState({ currentPage: 'privacy' })} />
            <SettingsList.Item title="About" onPress={() => this.setState({ currentPage: 'about' })} />
          </SettingsList>
        </View>
      );
    }
    render2() {

    }
}

