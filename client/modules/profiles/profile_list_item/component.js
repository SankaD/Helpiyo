import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

export default class ProfileComponent extends Component {
  render() {
    const { profile } = this.props;
    return (
      <TouchableOpacity style={styles.container} onPress={() => this.props.loadProfile(profile._id)}>
        <Image
          style={styles.profilePic}
          source={{ uri: profile.profilePic }}
          resizeMethod="auto"
          resizeMode="cover"
        />
        <View style={styles.middlePanel}>
          <Text style={styles.heroName}>{profile.heroName}</Text>
          <View style={styles.ratingPanel}>
            <Icon name="star" size={16} style={styles.ratingIcon} />
            <Text style={styles.ratingText}>{profile.rating ? profile.rating : '-'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

ProfileComponent.propTypes = {
  profile: PropTypes.object.isRequired,
  loadProfile: PropTypes.func.isRequired,
};
