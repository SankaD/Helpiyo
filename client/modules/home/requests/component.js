import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Answers } from 'react-native-fabric';
import styles from './styles';
import RequestView from '../../requests/request_view/container';
import Logger from '../../utils/logger';
import EmptyView from '../../common/empty_view/component';
import commonStyles from '../../common/styles';
import ActionButton from '../../common/action_button/action_button.container';

export default class MyRequestsComponent extends Component {
    static navigationOptions = {
      tabBarIcon: ({ tintColor }) => (<Icon name={commonStyles.icons.requests} size={24} color={tintColor} />),
      tabBarLabel: ({ focused, tintColor }) => (focused ? <Text style={{ color: tintColor, fontSize: 10 }}>Requests</Text> : null),
      header: null,
    };

    static renderListItem(item) {
      const request = item.item;
      return (
        <RequestView request={request} />
      );
    }

    constructor(props) {
      super(props);
      this.refreshList = this.refreshList.bind(this);
    }

    componentDidMount() {
      this.props.loadRequests();
      Answers.logCustom('load-page', { name: 'my-requests-page' });
    }

    componentDidUpdate() {
      if (this.props.reloadRequests) {
        this.props.loadRequests();
      }
    }

    renderEmptyView() {
      return (
        <EmptyView
          label1="You don't have any active requests."
          label2="Create a request with + button."
          onPress={this.props.openRequestCreator}
        />
      );
    }

    static renderFooter() {
      return (
        <View style={styles.listFooter} />
      );
    }

    refreshList() {
      Logger.info('refreshing list');
      this.props.loadRequests();
    }

    render() {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.props.requests}
            renderItem={item => MyRequestsComponent.renderListItem(item)}
            keyExtractor={(item, index) => item._id}
            refreshing={this.props.refreshing}
            style={styles.list}
            onRefresh={this.refreshList}
            contentContainerStyle={[{ flexGrow: 1 }, this.props.requests.length ? null : { justifyContent: 'center' }]}
            ListEmptyComponent={this.renderEmptyView()}
            ListFooterComponent={MyRequestsComponent.renderFooter()}
          />
          <ActionButton navigation={this.props.navigation} />

        </View>
      );
    }
}
MyRequestsComponent.propTypes = {
  loadRequests: PropTypes.func.isRequired,
  requests: PropTypes.array.isRequired,
  reloadRequests: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  openRequestCreator: PropTypes.func.isRequired,
};
