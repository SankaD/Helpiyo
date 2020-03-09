import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { Answers } from 'react-native-fabric';
import ServiceView from '../view/container';
import styles from './styles';
import commonStyles from '../../common/styles';
import LoadingScreen from '../../common/indicator/component';

export default class ServicePage extends Component {
    static navigationOptions={
      title: 'Service',
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
      this.props.loadService(this.props.serviceId);
    }
    componentDidMount() {
      Answers.logCustom('load-page', { name: 'service-viewer' });
    }
    componentDidUpdate() {
      if (this.props.tobeRefreshed) {
        this.props.loadService(this.props.serviceId);
      }
    }
    static renderLoadupPage() {
      return (
        <LoadingScreen visible />
      );
    }

    static renderService(service) {
      return (
        <ScrollView style={styles.container}>
          <ServiceView service={service} showElement={() => {}} />
        </ScrollView>
      );
    }
    render() {
      if (this.props.service) {
        return ServicePage.renderService(this.props.service);
      }
      return ServicePage.renderLoadupPage();
    }
}

ServicePage.propTypes = {
  serviceId: PropTypes.string.isRequired,
  service: PropTypes.object,
  loadService: PropTypes.func.isRequired,
  tobeRefreshed: PropTypes.bool.isRequired,
};
ServicePage.defaultProps = {
  service: null,
};
