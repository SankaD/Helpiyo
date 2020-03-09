import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Gallery from 'react-native-image-gallery';
import PropTypes from 'prop-types';
import styles from './styles';
import Toasts from '../utils/toast';
import commonStyles from '../common/styles';
import { Answers } from 'react-native-fabric';

export default class ImageView extends Component {
    static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      if (!params.showHeader) {
        return { header: null };
      }
      return {
        headerStyle: { backgroundColor: commonStyles.colors.color_2 },
        headerTitleStyle: { color: commonStyles.colors.label_color },
        headerTintColor: commonStyles.colors.label_color,
        title: 'Image Viewer',
      };
    };

    state={
      images: [],
      headerVisible: false,
    };

    componentWillMount() {
      Answers.logCustom('load-page', { name: 'image-view' });
      if (!this.props.images || this.props.images.length === 0) {
        Toasts.error('Images not found');
        Answers.logCustom('image-load-failed');
        this.props.navigation.goBack();
        return;
      }
      const images = [];
      this.props.images.forEach((image) => {
        images.push({
          source: {
            uri: image.url,
          },
        });
      });
      this.setState({ images });
    }

    setNavigationHeaderStatus(visible) {
      this.setState({ headerVisible: visible });
      this.props.navigation.setParams({ showHeader: visible });
    }

    render() {
      return (
        <SafeAreaView style={styles.container}>
          {/* <Image source={{ uri: this.props.uri }} style={styles.image} /> */}
          <Gallery
            images={this.state.images}
            // flatListProps={{ keyExtractor: (item, index) => (index.toString()) }}
            style={styles.gallery}
            initialPage={this.props.imageIndex}
            onSingleTapConfirmed={() => this.setNavigationHeaderStatus(!this.state.headerVisible)}
          />
        </SafeAreaView>
      );
    }
}

ImageView.propTypes = {
  // uri: PropTypes.string,
  images: PropTypes.array,
  imageIndex: PropTypes.number.isRequired,
};
ImageView.defaultProps = {
  // uri: undefined,
  images: [],
};
