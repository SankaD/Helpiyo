import React, { Component } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import GridView from 'react-native-super-grid';
import styles from './styles';
import commonStyles from '../../common/styles';
import { Answers } from 'react-native-fabric';

export default class BadgeView extends Component {
    static navigationOptions={
      title: 'Achievements',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };

    componentWillMount() {
      this.props.loadBadges(this.props.profileId);
    }
    componentDidMount() {
      Answers.logCustom('load-page', { name: 'badge-page' });
    }
    static renderLoadupScreen() {
      return (
        <SafeAreaView style={styles.loadupScreen}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadupScreenText}>Loading Achievements</Text>
        </SafeAreaView>
      );
    }
    static renderOverlay(badge) {
      if (!badge.expired) {
        return null;
      }
      return (<View style={styles.overlay} />
      );
    }
    static renderBadge(badge) {
      return (
        <View style={styles.badge}>
          {this.renderOverlay(badge)}
          <Text>{badge.label}</Text>
          <Image source={{ uri: badge.imageUrl }} style={styles.badgeImage} />
        </View>
      );
    }
    render() {
      console.log(this.props.achievements);
      const badges = this.props.achievements.map(ach => ({
        label: ach.badge[0].label,
        expired: ach.expired,
        imageUrl: ach.badge[0].imageUrl,
        createdOn: ach.createdOn,
      }));
      return (
        <SafeAreaView style={styles.container}>
          <GridView
            itemDimension={120}
            items={badges}
            renderItem={item => BadgeView.renderBadge(item)}
            style={styles.gridView}
          />
        </SafeAreaView>
      );
    }
}

BadgeView.propTypes = {
  // badges: PropTypes.array.isRequired,
  achievements: PropTypes.array.isRequired,
  loadBadges: PropTypes.func.isRequired,
  profileId: PropTypes.string.isRequired,
};

