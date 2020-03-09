import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsList from 'react-native-settings-list';
import commonStyles from '../../common/styles';

export default class GeneralSettingsPage extends Component {
    static navigationOptions = {
      title: 'Settings',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
    };

    render() {
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
}

