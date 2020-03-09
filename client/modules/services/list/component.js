import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import ServiceView from '../view/container';
import EmptyView from '../../common/empty_view/component';
import commonStyles from '../../common/styles';
import { Answers } from 'react-native-fabric';

export default class ServiceList extends Component {
    static navigationOptions = ({ navigation }) => ({
      title: 'Services',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    });

    constructor(props) {
      super(props);
      this.refreshFeed = this.refreshFeed.bind(this);
    }

    renderElement(item) {
      const service = item.item;
      service.creator = this.props.profile;
      return (
        <ServiceView service={service} />
      );
    }

    static renderEmptyView() {
      return (
        <EmptyView
          label1="No services found."
          label2=""
          onPress={() => {}}
        />
      );
    }

    static renderFooter() {
      return (
        <View style={styles.listFooter} />
      );
    }

    componentWillMount() {
      this.refreshFeed();
    }

    componentDidMount() {
      Answers.logCustom('load-page', { name: 'service-list-page' });
    }

    componentDidUpdate() {
      if (this.props.tobeRefreshed) {
        this.refreshFeed();
      }
    }

    refreshFeed() {
      this.props.loadServices(this.props.profile._id);
    }

    renderActionButton() {
      if (this.props.profile._id === this.props.currentProfileId) {
        return (
          <ActionButton
            buttonColor="#9b59b6"
            onPress={this.props.openServiceCreator}
            renderIcon={() => (<Icon name="briefcase-plus" style={styles.actionButtonIcon} />)}
          />
        );
      }
      return null;
    }

    render() {
      return (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={this.props.services}
            renderItem={item => this.renderElement(item)}
            refreshing={this.props.refreshing}
            keyExtractor={(item, index) => item._id}
            onRefresh={this.refreshFeed}
            contentContainerStyle={[{ flexGrow: 1 }, this.props.services.length ? null : { justifyContent: 'center' }]}
            style={styles.list}
            ListEmptyComponent={ServiceList.renderEmptyView()}
            ListFooterComponent={ServiceList.renderFooter()}
          />
          {this.renderActionButton()}
        </SafeAreaView>
      );
    }
}

ServiceList.propTypes = {
  services: PropTypes.array.isRequired,
  profile: PropTypes.object.isRequired,
  refreshing: PropTypes.bool.isRequired,
  loadServices: PropTypes.func.isRequired,
  tobeRefreshed: PropTypes.bool.isRequired,
  currentProfileId: PropTypes.string.isRequired,
  openServiceCreator: PropTypes.func.isRequired,
};
