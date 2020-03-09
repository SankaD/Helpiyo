import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Answers } from 'react-native-fabric';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import styles from '../../home/requests/styles';
import commonStyles from '../../common/styles';
import EmptyView from '../../common/empty_view/component';
import ResponseComponent from '../response_view/container';

export default class ResponsesForRequestComponent extends Component {
    static navigationOptions = {
      // tabBarIcon: ({ tintColor }) => (<Icon name="human-greeting" size={20} color={tintColor} />),
      title: 'Responses',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };

    static renderListItem(item) {
      const response = item.item;
      return (
        <ResponseComponent response={response} />
      );
    }

    constructor(props) {
      super(props);
      this.state = {
        currentResponseId: null,
      };
      this.refreshList = this.refreshList.bind(this);
    }

    showReporter() {
      this.props.showReportView(this.state.currentResponseId, 'response');
      this.setState({ currentResponseId: null });
    }

    componentDidMount() {
      this.props.loadResponses(this.props.requestId);
      Answers.logCustom('load-page', { name: 'response-for-request' });
    }

    componentDidUpdate() {
      if (this.props.reload) {
        this.props.loadResponses(this.props.requestId);
      }
    }

    static renderEmptyView() {
      return (
        <EmptyView
          label1={"Request doesn't have any active responses."}
          label2="Please wait till someone responds"
        />
      );
    }

    refreshList() {
      this.props.loadResponses(this.props.requestId);
    }

    render() {
      return (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={this.props.responses}
            renderItem={item => ResponsesForRequestComponent.renderListItem(item)}
            keyExtractor={(item, index) => item._id}
            refreshing={this.props.refreshing}
            onRefresh={this.refreshList}
            style={styles.list}
            contentContainerStyle={[{ flexGrow: 1 }, this.props.responses.length ? null : { justifyContent: 'center' }]}
            ListEmptyComponent={ResponsesForRequestComponent.renderEmptyView()}
          />
        </SafeAreaView>
      );
    }
}

ResponsesForRequestComponent.propTypes = {
  loadResponses: PropTypes.func.isRequired,
  reload: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  responses: PropTypes.array.isRequired,
  requestId: PropTypes.string.isRequired,
  showReportView: PropTypes.func.isRequired,
};
