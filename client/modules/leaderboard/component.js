import React, { Component } from 'react';
import { View, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Answers } from 'react-native-fabric';
import PropTypes from 'prop-types';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import styles from './styles';
import commonStyles from '../common/styles';

export default class LeaderBoard extends Component {
    static navigationOptions = {
      title: 'Hero Rankings',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };

    state = {
      index: 0,
      routes: [
        { key: 'global', title: 'Global' },
        { key: 'local', title: 'Local' },
      ],
    };

    componentWillMount() {
      this.props.loadLeaderBoard(0, 'global');
      this.props.loadLeaderBoard(0, 'local');
    }

    componentDidMount() {
      Answers.logCustom('load-page', { name: 'leaderboard-page' });
    }

    renderElement(element) {
      return (
        <TouchableOpacity
          style={this.props.currentProfileId === element.item._id ? styles.myElement : styles.element}
          onPress={() => this.props.showProfile(element.item._id)}
        >
          <View style={styles.panel1}>
            <Image
              style={styles.profilePic}
              source={{ uri: element.item.profilePic }}
              resizeMethod="auto"
              resizeMode="cover"
            />
            <View style={styles.panel2}>
              <Text style={styles.heroName}>
                {element.item.heroName}
              </Text>
              <Text style={styles.points}>
                {`${element.item.points} total points earned`}
              </Text>
            </View>
          </View>
          <Text style={styles.rank}>{element.item.ranking === 100000000 ? '' : element.item.ranking }</Text>
        </TouchableOpacity>
      );
    }

    loadLeaderboard(offset, name) {
      if (name === 'global' && this.props.endOfGlobalList) {
        return;
      } if (name === 'local' && this.props.endOfLocalList) {
        return;
      }
      this.props.loadLeaderBoard(offset, name);
    }

    renderLeaderboard(entries, name) {
      const offset = name === 'global' ? this.props.globalListOffset : this.props.localListOffset;
      const loading = name === 'global' ? this.props.loadingGlobal : this.props.loadingLocal;
      return (
        <View style={styles.tabPane}>
          <FlatList
            style={styles.list}
            data={entries}
            keyExtractor={(item, index) => item._id}
            renderItem={element => this.renderElement(element)}
            onEndReached={() => this.loadLeaderboard(offset, name)}
            onEndReachedThreshold={0}
            refreshing={loading}
            onRefresh={() => this.props.loadLeaderBoard(0, name)}
          />
        </View>
      );
    }

    render() {
      return (
        <SafeAreaView style={styles.container}>
          <TabView
            navigationState={this.state}
            renderScene={
                        SceneMap({
                          global: () => this.renderLeaderboard(this.props.globalList, 'global'),
                          local: () => this.renderLeaderboard(this.props.localList, 'local'),
                        })}
            renderTabBar={props => (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: commonStyles.colors.color_6 }}
                tabStyle={{ backgroundColor: commonStyles.colors.color_2 }}
                style={{ backgroundColor: commonStyles.colors.color_1 }}
              />
            )}
            onIndexChange={index => this.setState({ index })}
            tabBarPosition="bottom"
          />
        </SafeAreaView>
      );
    }
}

LeaderBoard.propTypes = {
  globalList: PropTypes.array.isRequired,
  localList: PropTypes.array.isRequired,
  loadLeaderBoard: PropTypes.func.isRequired,
  globalListOffset: PropTypes.number.isRequired,
  localListOffset: PropTypes.number.isRequired,
  endOfGlobalList: PropTypes.bool.isRequired,
  endOfLocalList: PropTypes.bool.isRequired,
  loadingGlobal: PropTypes.bool.isRequired,
  loadingLocal: PropTypes.bool.isRequired,
  showProfile: PropTypes.func.isRequired,
  currentProfileId: PropTypes.string.isRequired,
};
