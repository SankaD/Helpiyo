import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import { Answers } from 'react-native-fabric';
import ResponseComponent from '../response_view/container';
import styles from './styles';
import commonStyles from '../../common/styles';
import LoadingScreen from '../../common/indicator/component';

export default class ResponsePage extends Component {
    static navigationOptions={
      title: 'Response',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };
    componentWillMount() {
      this.props.loadResponse(this.props.responseId);
    }
    componentDidMount() {
      Answers.logCustom('load-page', { name: 'response-viewer' });
    }
    static renderLoadupPage() {
      return (
        <LoadingScreen visible />
      );
    }

    static renderResponse(response) {
      return (
        <ScrollView style={styles.container}>
          <ResponseComponent response={response} showElement={() => {}} />
        </ScrollView>
      );
    }
    render() {
      if (this.props.response) {
        return ResponsePage.renderResponse(this.props.response);
      }
      return ResponsePage.renderLoadupPage();
    }
}

ResponsePage.propTypes = {
  responseId: PropTypes.string.isRequired,
  response: PropTypes.object,
  loadResponse: PropTypes.func.isRequired,
};
ResponsePage.defaultProps = {
  response: null,
};
