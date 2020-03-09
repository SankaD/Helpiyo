import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-navigation';
import logger from '../../utils/logger';
import styles from './styles';
import RequestView from '../request_view/container';
import EmptyView from '../../common/empty_view/component';
import commonStyles from '../../common/styles';
import { Answers } from 'react-native-fabric';

export default class RequestList extends Component {
    static navigationOptions = ({ navigation }) => ({
      title: 'Requests for Service',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    });

    constructor(props) {
      super(props);
      this.refreshList = this.refreshList.bind(this);
    }

    renderListItem(item) {
      const request = item.item;
      return (
        <RequestView request={request} />
      );
    }
    componentDidMount() {
      Answers.logCustom('load-page', { name: 'requests-for-service-page' });
    }
    componentWillMount() {
      this.props.loadRequests(this.props.serviceId);
    }

    refreshList() {
      this.props.loadRequests(this.props.serviceId);
    }

    static renderEmptyView() {
      return (
        <EmptyView
          label1="No requests found for this service."
          label2="Please check again later."
          onPress={() => {}}
        />
      );
    }

    render() {
      return (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={this.props.requests}
            renderItem={item => this.renderListItem(item)}
            keyExtractor={(item, index) => item._id}
            refreshing={this.props.refreshing}
            style={styles.list}
            onRefresh={this.refreshList}
            contentContainerStyle={[{ flexGrow: 1 }, this.props.requests.length ? null : { justifyContent: 'center' }]}
            ListEmptyComponent={RequestList.renderEmptyView()}
          />
        </SafeAreaView>
      );
    }
}

RequestList.propTypes = {
  requests: PropTypes.array.isRequired,
  refreshing: PropTypes.bool.isRequired,
  loadRequests: PropTypes.func.isRequired,
  serviceId: PropTypes.string.isRequired,
};
