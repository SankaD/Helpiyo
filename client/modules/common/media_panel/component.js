import React, { Component } from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Logger from '../../utils/logger';

import styles from './styles';

export default class MediaPanelComponent extends Component {
  renderImageRemoveButton(editMode, filename) {
    if (editMode) {
      return (
        <TouchableOpacity style={styles.closeButton} onPress={() => this.props.onImageRemove(filename)}>
          <Icon name="close-box" size={16} style={styles.closeButtonIcon} />
        </TouchableOpacity>
      );
    }
    return null;
  }
  renderImage(item, index, editMode) {
    return (
      <View style={styles.image}>
        {this.renderImageRemoveButton(editMode, item.item.filename)}
        <Image
          source={{ uri: item.item.thumbnail || item.item.url }}
          style={styles.image}
          resizeMethod="auto"
          resizeMode="cover"
        />
        {/* <Text style={styles.imageText}>{item.item.filename}</Text> */}
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
    };
    Logger.info('media_panel::props');
  }
  render() {
    return (
      <View style={styles.imagePanel}>
        <TouchableHighlight style={styles.uploadButton} onPress={this.props.openImageSelector} disabled={this.props.disabled} underlayColor="#EEE">
          <Text style={styles.buttonText}>Upload Images</Text>
        </TouchableHighlight>
        <Carousel
          data={this.props.images.filter(image => image.operation !== 'remove')}
          renderItem={(item, index) => this.renderImage(item, index, this.props.editMode)}
          sliderWidth={400}
          itemWidth={200}
          style={styles.carousel}
        />
      </View>
    );
  }
}

MediaPanelComponent.propTypes = {
  openImageSelector: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  editMode: PropTypes.bool.isRequired,
  onImageRemove: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

MediaPanelComponent.defaultProps = {
  images: [],
};

