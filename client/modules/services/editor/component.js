import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import {
  View, Text, ScrollView, TextInput, TouchableHighlight, TouchableOpacity,
} from 'react-native';
import MapView from 'react-native-maps';
import ImagePicker from 'react-native-image-crop-picker';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Answers } from 'react-native-fabric';
import ErrorPanel from '../../common/error_panel/component';
import styles from './styles';
import CurrencySelector from '../../common/currency_selector/component';
import MediaPanel from '../../common/media_panel/component';
import commonStyles from '../../common/styles';
import LocationModal from '../../common/location_modal/component';
import Indicator from '../../common/indicator/component';
import Logger from '../../utils/logger';
import Toast from '../../utils/toast';

export default class ServiceEditor extends Component {
    static navigationOptions = ({ navigation }) => {
      const params = navigation.state.params;

      return {
        title: params.mode === 'create' ? 'Create a service' : 'Edit service',
        headerStyle: { backgroundColor: commonStyles.colors.color_2 },
        headerTitleStyle: { color: commonStyles.colors.label_color },
        headerTintColor: commonStyles.colors.label_color,
      };
    };

    state = {};

    constructor(props) {
      super(props);
      const element = props.service;
      this.state = {
        title: element.title,
        post: element.post,
        currency: element.currency,
        // points: element.points,
        money: element.money,
        locationName: element.locationName,
        location: element.location,
        locationSet: element.locationSet,
        startTime: element.startTime,
        endTime: element.endTime,
        selectingTime: '',
        pickerDate: new Date(),
        pickerMaxDate: new Date(2100, 1, 1),
        pickerMinDate: new Date(1800, 1, 1),
        isShowingLocationPicker: false,
        isShowingDateTimePicker: false,
        photos: element.photos.map(photo => ({
          url: photo.url, operation: '', filename: photo.filename || '', uploaded: true,
        })),
        tags: element.tags,
        currentTag: '',
      };
      this.handleLocationChange = this.handleLocationChange.bind(this);
      this.hideLocationPicker = this.hideLocationPicker.bind(this);
      this.submit = this.submit.bind(this);
      this.showLocationPicker = this.showLocationPicker.bind(this);
      this.showImagePicker = this.showImagePicker.bind(this);
    }

    componentDidMount() {
      Answers.logCustom('load-page', { name: 'service-editor-page' });
    }

    onImageRemove(filename, setState) {
      Logger.info(`removing image : ${filename}`);
      setState({
        photos: this.state.photos.map((imageData) => {
          Logger.info(imageData);
          if (imageData.filename === filename) {
            if (imageData.uploaded) {
              return Object.assign({}, imageData, { operation: 'remove' });
            }
            return null;
          }
          return imageData;
        }).filter(image => image !== null),
      });
    }

    showLocationPicker() {
      Logger.info('showing location picker');

      this.setState({
        isShowingLocationPicker: true,
      });
    }

    handleLocationChange(location) {
      Logger.info('location changed');
      Logger.debug(location);
      this.setState({
        locationName: location.name,
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
        locationSet: true,
      });
    }

    hideLocationPicker() {
      Logger.info('hiding location picker');
      this.setState({ isShowingLocationPicker: false });
    }

    showImagePicker(setState) {
      ImagePicker.openPicker({
        multiple: true,
        compressImageMaxWidth: 1280,
        compressImageMaxHeight: 1280,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      })
        .then((images) => {
          Logger.info(`images selected. count = ${images.length}`);
          Logger.info(images);
          const currentImages = this.state.photos.map(image => image.filename);
          const newImages = this.state.photos;
          images.forEach((image) => {
            const filename = image.path.split('/').pop();
            if (!currentImages.includes(filename)) {
              const sizeLimitInMB = 2;
              if (image.size > sizeLimitInMB * 1024 * 1024) {
                Toast.warn(`Not uploading images larger than ${sizeLimitInMB}MB`);
                return;
              }
              newImages.push({
                url: image.path,
                filename,
                operation: 'add',
              });
            }
          });
          setState({ photos: newImages });
        })
        .catch((error) => {
          Logger.info('Images not selected');
          Logger.error(error);
        });
    }

    submit() {
      Logger.info('Submitting...');

      const elementData = Object.assign({}, this.props.service, {
        title: this.state.title,
        post: this.state.post,
        currency: this.state.currency,
        money: this.state.money,
        locationName: 'address',
        location: this.state.location,
        locationSet: this.state.locationSet,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        photos: this.state.photos,
        tags: this.state.tags,
      });
      Logger.info(elementData);
      this.props.saveElement(elementData);
    }

    onAddTag(text) {
      if (text.includes(' ')) {
        const tag = text.split(' ')[0];
        if (tag === '') {
          this.setState({ currentTag: '' });
          return;
        }
        if (this.state.tags.includes(tag)) {
          this.setState({ currentTag: '' });
          return;
        }
        if (this.state.tags.length > 3) {
          this.setState({ currentTag: '' });
          Toast.error('Tag count should be less than 4');
          return;
        }
        const newTags = Object.assign([], this.state.tags);
        newTags.push(tag.toLowerCase());
        this.setState({ tags: newTags, currentTag: '' });
      } else {
        this.setState({ currentTag: text });
      }
    }

    onRemoveTag(tag) {
      const newTags = this.state.tags.filter(tag2 => tag2 !== tag);
      this.setState({ tags: newTags });
    }

    renderTags(tags) {
      return tags.map(tag => (
        <TouchableOpacity style={styles.tag} onPress={() => this.onRemoveTag(tag)} key={tag}>
          <View style={styles.tagView}>
            <Text style={styles.tagLabel}>{tag}</Text>
            <Icon name="close" size={16} style={styles.tagButton} />
          </View>
        </TouchableOpacity>
      ));
    }

    renderMapView() {
      if (this.state.locationSet === true) {
        return (
          <MapView
            style={styles.mapView}
            showsUserLocation
                    // showsMyLocationButton
            initialRegion={{
              latitude: this.state.location.coordinates[1],
              longitude: this.state.location.coordinates[0],
              latitudeDelta: 0.0122,
              longitudeDelta: 0.0122,
            }}
            region={{
              latitude: this.state.location.coordinates[1],
              longitude: this.state.location.coordinates[0],
              latitudeDelta: 0.0122,
              longitudeDelta: 0.0122,
            }}
          >
            <MapView.Marker
              title="Service location"
              coordinate={{
                latitude: this.state.location.coordinates[1],
                longitude: this.state.location.coordinates[0],
              }}
            />
          </MapView>
        );
      }
      return (
        <View style={styles.emptyMapView}>
          <Text style={styles.emptyMapViewLabel}>Set location here</Text>
        </View>
      );
    }

    render() {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <ErrorPanel
              testId="misc error"
              errorMessage={this.props.errors.miscError}
              messageUnderView={false}
            />
            <ErrorPanel testId="post error" errorMessage={this.props.errors.postError}>
              <TextInput
                maxLength={2500}
                placeholder="Can you describe your service?"
                style={styles.postTextInput}
                onChangeText={text => this.setState({ post: text })}
                defaultValue={this.state.post}
                underlineColorAndroid="transparent"
                height={120}
                multiline
                editable={!this.props.submitting}
                selectTextOnFocus={!this.props.submitting}
              />
            </ErrorPanel>
            <View style={styles.paymentPanel}>
              <ErrorPanel testId="currency error" errorMessage={this.props.errors.currencyError}>
                <View style={styles.currencyPanel}>
                  <TextInput
                    maxLength={10}
                    placeholder="How much is your service ?"
                    keyboardType="numeric"
                    style={styles.currencyTextInput}
                    defaultValue={`${this.state.money || ''}`}
                    underlineColorAndroid="transparent"
                    height={48}
                    onChangeText={text => this.setState({ money: text })}
                    editable={!this.props.submitting}
                    selectTextOnFocus={!this.props.submitting}
                  />
                  <CurrencySelector
                    style={styles.picker}
                    selectedCurrency={this.state.currency}
                    onCurrencySelect={currency => this.setState({ currency })}
                  />
                </View>
              </ErrorPanel>
            </View>
            <ErrorPanel testId="location error" errorMessage={this.props.errors.locationError}>
              <TouchableOpacity
                onPress={this.showLocationPicker}
                style={styles.locationPanel}
                disable={this.props.submitting}
              >
                {this.renderMapView()}
              </TouchableOpacity>
            </ErrorPanel>
            <ErrorPanel testId="image error" errorMessage={this.props.errors.imageError}>
              <MediaPanel
                openImageSelector={() => {
                  this.showImagePicker(this.setState.bind(this));
                }}
                images={this.state.photos}
                editMode
                onImageRemove={filename => this.onImageRemove(filename, this.setState.bind(this))}
                disabled={this.props.submitting}
              />
            </ErrorPanel>

          </ScrollView>
          <TouchableHighlight
            style={this.props.submitting ? styles.disabledButton : styles.submitButton}
            onPress={this.submit}
            disabled={this.props.submitting}
          >
            <Text style={styles.submitButtonText}>Save</Text>
          </TouchableHighlight>

          <LocationModal
            onSubmit={this.handleLocationChange}
            modalVisible={this.state.isShowingLocationPicker}
            location={{
              latitude: this.state.location.coordinates[1] || 0,
              longitude: this.state.location.coordinates[0] || 0,
              name: this.state.locationName || '',
            }}
            hideModal={this.hideLocationPicker}
          />
          <Indicator visible={this.props.submitting} />
        </SafeAreaView>
      );
    }
}

ServiceEditor.propTypes = {
  errors: PropTypes.object.isRequired,
  submitting: PropTypes.bool.isRequired,
  service: PropTypes.object.isRequired,
  saveElement: PropTypes.func.isRequired,
};
