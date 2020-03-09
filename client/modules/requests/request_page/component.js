import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { Answers } from 'react-native-fabric';
import RequestView from '../request_view/container';
import styles from './styles';
import commonStyles from '../../common/styles';
import LoadingScreen from '../../common/indicator/component';

export default class RequestPage extends Component {
    static navigationOptions={
      title: 'Request',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };
    constructor(props) {
      super(props);
      this.state = {
      };
    }
    componentWillMount() {
      this.props.loadRequest(this.props.requestId);
    }
    componentDidMount() {
      Answers.logCustom('load-page', { name: 'request-viewer' });
    }
    componentDidUpdate() {
      if (this.props.tobeRefreshed) {
        this.props.loadRequest(this.props.requestId);
      }
    }
    static renderLoadupPage() {
      return (
        <LoadingScreen visible />
      );
    }

    static renderRequest(request) {
      return (
        <ScrollView style={styles.container}>
          <RequestView request={request} showElement={() => {}} />
        </ScrollView>
      );
    }
    render() {
      if (this.props.request) {
        return RequestPage.renderRequest(this.props.request);
      }
      return RequestPage.renderLoadupPage();
    }
}

RequestPage.propTypes = {
  requestId: PropTypes.string.isRequired,
  request: PropTypes.object,
  loadRequest: PropTypes.func.isRequired,
};
RequestPage.defaultProps = {
  request: null,
};
