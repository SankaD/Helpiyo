import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableHighlight, Picker,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import { Answers } from 'react-native-fabric';
import styles from './styles';
import Logger from '../utils/logger';
import commonStyles from '../common/styles';

export default class ReportModal extends Component {
    static navigationOptions = {
      title: 'Reporter',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };

    constructor(props) {
      super(props);
      this.state = {
        comment: null,
        category: 'other',
      };
      this.report = this.report.bind(this);
    }

    componentDidMount() {
      Answers.logCustom('load-page', { name: 'reporter-page' });
    }

    report() {
      Logger.info('Reporting...');
      this.props.report(
        this.props.elementId,
        this.state.comment,
        this.state.category,
        this.props.elementType.toLowerCase(),
      );
    }

    render() {
      return (
        <View style={styles.container}>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.comment}
            multiline
            numberOfLines={4}
            maxlength={2000}
            onChangeText={text => this.setState({ comment: text })}
            placeholder="Enter your complaint here..."
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={this.state.category}
              style={styles.picker}
              defaultValue={this.state.category}
              onValueChange={(itemValue, itemIndex) => this.setState({ category: itemValue })}
            >
              <Picker.Item label="Category - Racial" value="racial" />
              <Picker.Item label="Category - Inappropriate" value="age-inappropriate" />
              <Picker.Item label="Category - SOS Spamming" value="sos-spamming" />
              <Picker.Item label="Category - Other" value="other" />
            </Picker>
          </View>
          <TouchableHighlight style={styles.button} onPress={this.report}>
            <Text style={styles.buttonText}>Report</Text>
          </TouchableHighlight>
        </View>
      );
    }
}

ReportModal.propTypes = {
  elementType: PropTypes.string.isRequired,
  elementId: PropTypes.string.isRequired,
  report: PropTypes.func.isRequired,
};
