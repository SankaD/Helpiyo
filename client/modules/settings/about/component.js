import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import SettingsList from 'react-native-settings-list';
import commonStyles from '../../common/styles';

export default class AboutSettingsPage extends Component {
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

    render() {
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
}

