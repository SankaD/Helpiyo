import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import commonStyles from '../../common/styles';
import styles from './styles';
import EmptyView from '../../common/empty_view/component';

export default class InterestSetter extends Component {
    static navigationOptions = {
      title: 'My Interests',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };
    state={
      tag: '',
    };
    constructor(props) {
      super(props);
      this.submitInterest = this.submitInterest.bind(this);
      this.removeInterest = this.removeInterest.bind(this);
    }
    componentWillMount() {
      this.refreshList();
    }
    componentDidUpdate() {
      if (this.props.tobeRefreshed) {
        this.refreshList();
      }
    }
    submitInterest() {
      const interests = [...this.props.interests];
      interests.push(this.state.tag);
      if (interests.length > 10) {
        interests.pop();
      }
      this.setState({ tag: '' });
      this.props.setInterests(interests);
    }
    removeInterest(interest) {
      const interests = this.props.interests.filter(i => i !== interest);
      this.setState({ tag: '' });
      this.props.setInterests(interests);
    }
    renderListItem(element) {
      return (
        <View style={styles.element}>
          <Text style={styles.elementText}>{element}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => this.removeInterest(element)}
          >
            <Icon name="close" size={20} style={styles.removeIcon} />
          </TouchableOpacity>
        </View>
      );
    }
    refreshList() {
      this.props.loadInterests();
    }
    static renderEmptyView() {
      return (
        <EmptyView
          label1="No current interests found"
          label2=""
          onPress={() => {}}
        />
      );
    }
    render() {
      return (
        <View style={styles.container}>
          <View style={styles.inputPanel}>
            <TextInput
              style={styles.input}
              placeholder="Enter any word here and submit..."
              onChangeText={text => this.setState({ tag: text })}
              defaultValue={this.state.tag}
            />
            <TouchableOpacity style={styles.sendButton} onPress={this.submitInterest}>
              <Icon name="send" size={20} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={this.props.interests}
            renderItem={item => this.renderListItem(item.item)}
            keyExtractor={(item, index) => item}
            refreshing={this.props.refreshing}
            style={styles.list}
            onRefresh={this.refreshList}
          />
        </View>
      );
    }
}

InterestSetter.propTypes = {
  interests: PropTypes.array.isRequired,
  refreshing: PropTypes.bool.isRequired,
  loadInterests: PropTypes.func.isRequired,
  setInterests: PropTypes.func.isRequired,
  tobeRefreshed: PropTypes.bool.isRequired,
};
