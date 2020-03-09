import React, { Component } from 'react';
import {
  View,
  FlatList,
  Text,
} from 'react-native';
import { Answers } from 'react-native-fabric';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import styles from './styles';
import ResponseView from '../../responses/response_view/container';
import Logger from '../../utils/logger';
import EmptyView from '../../common/empty_view/component';
import commonStyles from '../../common/styles';
import ActionButton from '../../common/action_button/action_button.container';

export default class MyResponsesPage extends Component {
    static navigationOptions = {
      tabBarIcon: ({ tintColor }) => (<Icon name={commonStyles.icons.responses} size={24} color={tintColor} style={{ alignSelf: 'center' }} />),
      tabBarLabel: ({ focused, tintColor }) => (focused ? <Text style={{ color: tintColor, fontSize: 10 }}>Responses</Text> : null),
      header: null,
    };

    constructor(props) {
      super(props);
      this.refreshList = this.refreshList.bind(this);
    }

    componentDidMount() {
      this.props.loadResponses();
      Answers.logCustom('load-page', { name: 'my-responses-page' });
    }

    componentDidUpdate() {
      if (this.props.reloadResponses) {
        this.props.loadResponses();
      }
    }

    renderEmptyView() {
      return (
        <EmptyView
          label1={"You don't have any active responses."}
          label2="Respond to a request in the feed?"
          onPress={() => this.props.navigation.navigate('Feed')}
        />
      );
    }

    refreshList() {
      Logger.info('refreshing list');
      this.props.loadResponses();
    }

    showCommentView(responseId) {
      this.props.showComments('response', responseId);
    }

    static renderListItem(item) {
      const response = item.item;

      return (
        <ResponseView response={response} />
      );
    }

    static renderFooter() {
      return (
        <View style={styles.listFooter} />
      );
    }

    render() {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.props.responses}
            renderItem={item => MyResponsesPage.renderListItem(item)}
            keyExtractor={(item, index) => item._id}
            refreshing={this.props.refreshing}
            onRefresh={this.refreshList}
            style={styles.list}
            contentContainerStyle={[{ flexGrow: 1 }, this.props.responses.length ? null : { justifyContent: 'center' }]}
            ListEmptyComponent={this.renderEmptyView()}
            ListFooterComponent={MyResponsesPage.renderFooter()}
          />
          <ActionButton navigation={this.props.navigation} />

        </View>
      );
    }
}

MyResponsesPage.propTypes = {
  loadResponses: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  responses: PropTypes.array.isRequired,
  reloadResponses: PropTypes.bool.isRequired,
  showComments: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};
