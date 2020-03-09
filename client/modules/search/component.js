import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { SearchBar } from 'react-native-elements';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import EmptyView from '../common/empty_view/component';
import RequestComponent from '../requests/request_view/container';
import ProfileComponent from '../profiles/profile_list_item/container';
import commonStyles from '../common/styles';
import ServiceViewComponent from '../services/view/container';
import { Answers } from 'react-native-fabric';

export default class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTimeout: null,
      searchString: this.props.searchString,
    };
    this.refreshFeed = this.refreshFeed.bind(this);
  }

  onSearch(text) {
    clearTimeout(this.state.searchTimeout);
    this.setState({ searchTimeout: null, searchString: text });
    if (text !== '') {
      this.setState({
        searchTimeout: setTimeout(() => {
          this.props.search(text, this.props.filter);
        }, 500),
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.searchTimeout);
  }

  componentDidMount() {
    this.searchBar.focus();
    Answers.logCustom('load-page', { name: 'search-page' });
  }

  refreshFeed() {
    this.onSearch(this.state.searchString);
  }

  onFilterChange(filter) {
    this.props.onFilterChange(filter);
    this.onSearch(this.state.searchString);
  }

  renderSearchBar() {
    return (
      <View style={styles.topPanel}>
        <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack()}>
          <Icon name="arrow-left" size={24} style={styles.backIcon} />
        </TouchableOpacity>
        <SearchBar
          ref={ref => this.searchBar = ref}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
          inputStyle={styles.searchBarInput}
          defaultValue={this.state.searchString}
          icon={{ style: styles.icon }}
          // searchIcon={false}
          // clearIcon={false}
          placeholder="Search here..."
          lightTheme
          onChangeText={text => this.onSearch(text)}
        />
      </View>
    );
  }

  static renderEmptyView() {
    return (
      <EmptyView
        label1="No results found"
      />
    );
  }

  renderFilterBar() {
    return (
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={this.props.filter === 'request' ? styles.filterToggleOn : styles.filterToggleOff}
          onPress={() => this.onFilterChange('request')}
        >
          <Icon name={commonStyles.icons.requests} size={24} style={this.props.filter === 'request' ? styles.filterIcon : styles.filterIconOff} />
        </TouchableOpacity>
        <TouchableOpacity
          style={this.props.filter === 'profile' ? styles.filterToggleOn : styles.filterToggleOff}
          onPress={() => this.onFilterChange('profile')}
        >
          <Icon name="face" size={24} style={this.props.filter === 'profile' ? styles.filterIcon : styles.filterIconOff} />
        </TouchableOpacity>
        <TouchableOpacity
          style={this.props.filter === 'service' ? styles.filterToggleOn : styles.filterToggleOff}
          onPress={() => this.onFilterChange('service')}
        >
          <Icon name="tag" size={24} style={this.props.filter === 'service' ? styles.filterIcon : styles.filterIconOff} />
        </TouchableOpacity>
      </View>
    );
  }

  static renderRequest(request) {
    return (<RequestComponent request={request} />);
  }

  static renderProfile(profile) {
    return (
      <ProfileComponent profile={profile} />
    );
  }

  static renderService(service) {
    return (
      <ServiceViewComponent service={service} />
    );
  }

  static renderElement(element, filter) {
    if (filter === 'request') {
      return SearchPage.renderRequest(element.item);
    }
    if (filter === 'profile') {
      return SearchPage.renderProfile(element.item);
    }
    if (filter === 'service') {
      return SearchPage.renderService(element.item);
    }
    return <View />;
  }

  render() {
    let data = this.props.results.requests;
    if (this.props.filter === 'profile') {
      data = this.props.results.profiles;
    } else if (this.props.filter === 'service') {
      data = this.props.results.services;
    }
    return (
      <SafeAreaView style={styles.container}>
        {this.renderSearchBar()}
        {this.renderFilterBar()}
        <FlatList
          data={data}
          renderItem={item => SearchPage.renderElement(item, this.props.filter)}
          refreshing={this.props.refreshing}
          keyExtractor={(item, index) => item._id}
          onRefresh={this.refreshFeed}
          contentContainerStyle={[{ flexGrow: 1 }, data.length ? null : { justifyContent: 'center' }]}
          style={styles.list}
          ListEmptyComponent={SearchPage.renderEmptyView()}
        />
      </SafeAreaView>
    );
  }
}

SearchPage.propTypes = {
  results: PropTypes.object.isRequired,
  searchString: PropTypes.string,
  filter: PropTypes.string.isRequired,
  refreshing: PropTypes.bool.isRequired,
  search: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

SearchPage.defaultProps = {
  searchString: '',
};
