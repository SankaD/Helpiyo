import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { View, TextInput, Text, TouchableHighlight } from 'react-native';
import { Answers } from 'react-native-fabric';
import SettingsList from 'react-native-settings-list';
import CustomModal from '../../common/custom_modal/component';
import styles from './styles';
import ErrorPanel from '../../common/error_panel/component';
import commonStyles from '../../common/styles';

export default class AccountSettingsPage extends Component {
    static navigationOptions = {
      title: 'Settings',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };

    constructor(props) {
      super(props);
      this.state = {
        currentPassword: '',
        newPassword: '',
        passwordConfirmation: '',
        feedback: this.props.feedback,
      };
      this.submitFeedback = this.submitFeedback.bind(this);
    }
    componentDidMount() {
      Answers.logCustom('load-page', { name: 'account-settings' });
    }
    changePassword() {
      this.props.changePassword(this.state.currentPassword, this.state.newPassword, this.state.passwordConfirmation);
      this.setState({ passwordConfirmation: '' });
    }
    submitFeedback() {
      this.props.submitFeedback(this.state.feedback);
    }

    renderFeedbackModal() {
      return (
        <CustomModal modalVisible={this.props.feedbackModalVisible} hideModal={() => this.props.showFeedbackModal(false)}>
          <View style={styles.modal}>
            <Text style={styles.label}>Feedback</Text>
            <ErrorPanel testId="confirm password" errorMessage={this.props.feedbackError}>
              <TextInput
                style={styles.textInput}
                onChangeText={text => this.setState({ feedback: text })}
                multiline
                numberOfLines={5}
                placeholder="Enter your complaints, feature requests and other feedback here..."
              />
            </ErrorPanel>
            <TouchableHighlight style={styles.submitButton} onPress={this.submitFeedback}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableHighlight>
          </View>
        </CustomModal>
      );
    }
    render() {
      return (
        <SafeAreaView style={styles.container}>
          <SettingsList
            backgroundColor={commonStyles.colors.color_1}
          >
            <SettingsList.Item
              title="Set your interests"
              onPress={() => this.props.setInterests()}
              backgroundColor={commonStyles.colors.color_3}
              titleStyle={{ color: commonStyles.colors.label_color }}
              underlayColor={commonStyles.colors.label_color}
              arrowStyle={{ tintColor: commonStyles.colors.label_color }}
            />
            <SettingsList.Item
              title="Provide feedback"
              onPress={() => this.props.showFeedbackModal(true)}
              backgroundColor={commonStyles.colors.color_3}
              titleStyle={{ color: commonStyles.colors.label_color }}
              underlayColor={commonStyles.colors.label_color}
              arrowStyle={{ tintColor: commonStyles.colors.label_color }}
            />
            <SettingsList.Item
              title="Link with Facebook Authentication"
              onPress={() => this.props.linkWithFacebook()}
              backgroundColor={commonStyles.colors.color_3}
              titleStyle={{ color: commonStyles.colors.label_color }}
              underlayColor={commonStyles.colors.label_color}
              arrowStyle={{ tintColor: commonStyles.colors.label_color }}
            />

          </SettingsList>
          {this.renderFeedbackModal()}
        </SafeAreaView>
      );
    }
}

AccountSettingsPage.propTypes = {
  changePassword: PropTypes.func.isRequired,
  feedback: PropTypes.string,
  feedbackError: PropTypes.string,
  showFeedbackModal: PropTypes.func.isRequired,
  feedbackModalVisible: PropTypes.bool.isRequired,
  submitFeedback: PropTypes.func.isRequired,
  linkWithFacebook: PropTypes.func.isRequired,
  setInterests: PropTypes.func.isRequired,
};

AccountSettingsPage.defaultProps = {
  feedback: '',
  feedbackError: '',
};
