import React, { Component } from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import commonStyles from '../../common/styles';
import * as numbers from '../../utils/numbers';

export default class ProfileView extends Component {
  renderTopPanel() {
    if (this.props.menuButtonVisible) {
      return (
        <TouchableOpacity style={styles.topPanel} onPress={this.props.onMenuButtonClicked}>
          <Icon name="dots-horizontal" size={24} color="#FFF" style={styles.menuIcon} />
        </TouchableOpacity>
      );
    }
    return null;
  }

  renderImageIcon() {
    if (this.props.picChangeAllowed) {
      return (
        <View style={styles.profilePicIconContainer}>
          <Icon name="camera" size={16} style={styles.profilePicIcon} color="#FFF" />
        </View>
      );
    }
    return null;
  }

  renderHeroNameIcon() {
    if (this.props.nameChangeAllowed) {
      return (
        <Icon name="account-edit" size={16} style={styles.heroNameIcon} color="#FFF" />
      );
    }
    return null;
  }

  render() {
    return (
      <LinearGradient
        style={styles.container}
        colors={[
          `${commonStyles.colors.color_1}`,
          `${commonStyles.colors.color_2}`,
        ]}
      >
        {/* {this.renderTopPanel()} */}
        <View style={styles.middlePanel}>
          <View style={styles.leftColumn}>
            <TouchableOpacity onPress={this.props.showFollowers} style={styles.followerButton}>
              <Text style={styles.followerLabel}>Followers</Text>
              <Text style={styles.followerCount}>{numbers.intToAbbreviated(this.props.profile.followerCount)}</Text>
            </TouchableOpacity>
            <View style={styles.ratingView}>
              <Text style={styles.ratingLabel}>Rating</Text>
              <Text style={styles.ratingValue}>{this.props.profile.rating ? this.props.profile.rating.toFixed(2) : '-'}</Text>
            </View>
          </View>
          <View style={styles.middleColumn}>
            <TouchableOpacity
              style={styles.profilePicButton}
              onPress={() => { this.props.picChangeAllowed ? this.props.showImageSelector() : this.props.onMenuButtonClicked(); }}
            >
              {this.renderImageIcon()}
              <Image
                style={styles.profilePic}
                source={{ uri: this.props.profile.profilePic }}
                resizeMethod="auto"
                resizeMode="cover"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroNamePanel} onPress={this.props.showNameChangeModal}>
              {this.renderHeroNameIcon()}
              <Text style={styles.displayName}>{this.props.profile.heroName}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.classView}>
              <Text style={styles.classLabel}>Class</Text>
              <Text style={styles.classValue}>{this.props.profile.classLabel}</Text>
            </View>
            <View style={styles.rankView}>
              <Text style={styles.rankLabel}>Rank</Text>
              <Text style={styles.rankValue}>{this.props.profile.classRanking === 10000000 ? 'NA' : this.props.profile.classRanking}</Text>
            </View>

          </View>
        </View>
      </LinearGradient>
    );
  }
}

ProfileView.propTypes = {
  profile: PropTypes.object.isRequired,
  menuButtonVisible: PropTypes.bool.isRequired,
  picChangeAllowed: PropTypes.bool.isRequired,
  nameChangeAllowed: PropTypes.bool.isRequired,
  onMenuButtonClicked: PropTypes.func.isRequired,
  showFollowers: PropTypes.func.isRequired,
  showImageSelector: PropTypes.func.isRequired,
  showNameChangeModal: PropTypes.func,
};

ProfileView.defaultProps = {
  showNameChangeModal: () => {},
};
