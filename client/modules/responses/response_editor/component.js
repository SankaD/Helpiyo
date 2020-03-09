import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput, TouchableHighlight, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Answers } from 'react-native-fabric';
import GeoCoding from 'react-native-geocoding';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { SafeAreaView } from 'react-navigation';
import Toast from '../../utils/toast';
import styles from './styles';
import ErrorPanel from '../../common/error_panel/component';
import LocationModal from '../../common/location_modal/component';
import MediaPanel from '../../common/media_panel/component';
import Logger from '../../utils/logger';
import Indicator from '../../common/indicator/component';
import commonStyles from '../../common/styles';
import CurrencySelector from '../../common/currency_selector/component';

class ResponseEditorComponent extends Component {
    static navigationOptions = ({ navigation }) => {
      const params = navigation.state.params;

      return {
        title: params.mode === 'create' ? 'Create a response' : 'Update the response',
        headerStyle: { backgroundColor: commonStyles.colors.color_2 },
        headerTitleStyle: { color: commonStyles.colors.label_color },
        headerTintColor: commonStyles.colors.label_color,
      };
    };

    constructor(props) {
      super(props);
      const element = this.props.response;
      this.state = {
        post: element.post,
        currency: element.currency,
        money: element.money,
        locationName: element.locationName,
        latitude: element.latitude,
        longitude: element.longitude,
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
      };
      this.handleSelectedDate = this.handleSelectedDate.bind(this);
      this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
      this.handleLocationChange = this.handleLocationChange.bind(this);
      this.hideLocationPicker = this.hideLocationPicker.bind(this);
      this.submit = this.submit.bind(this);
      this.showDateTimePicker = this.showDateTimePicker.bind(this);
      this.showImagePicker = this.showImagePicker.bind(this);
      this.showLocationPicker = this.showLocationPicker.bind(this);
    }

    componentWillMount() {
      Logger.info(`componentWillMount : ${this.state.latitude}`);
    }

    componentDidMount() {
      Answers.logCustom('load-page', { name: 'response-editor' });
    }

    hideDateTimePicker() {
      Logger.info('hiding date time picker');
      this.setState({ isShowingDateTimePicker: false });
    }

    showDateTimePicker(selector) {
      Logger.info(`showing time picker : ${selector}`);
      let pickerDate = new Date();
      const pickerMaxDate = new Date(2100, 1, 1);
      const pickerMinDate = new Date(1800, 1, 1);
      if (selector === 'start') {
        pickerDate = new Date(this.state.startTime || pickerDate);
      }
      this.setState({
        selectingTime: selector,
        isShowingDateTimePicker: true,
        pickerDate,
        pickerMaxDate,
        pickerMinDate,
      });
    }

    handleSelectedDate(date) {
      Logger.info(`date selected : ${date}`);
      if (this.state.selectingTime === 'start') {
        this.setState({
          startTime: date,
          selectingTime: '',
          isShowingDateTimePicker: false,
        });
      } else {
        this.hideDateTimePicker();
      }
    }

    showLocationPicker() {
      Logger.info('showing location picker');
      this.setState({
        isShowingLocationPicker: true,
      });
    }

    handleLocationChange(location) {
      Logger.info('location changed');
      this.setState({
        locationName: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
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

    onImageRemove(filename, setState) {
      Logger.info(`removing image : ${filename}`);
      setState({
        images: this.state.photos.map((imageData) => {
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

    submit() {
      Logger.info('Submitting...');
      const elementData = Object.assign({}, this.props.response, {
        post: this.state.post,
        currency: this.state.currency,
        money: this.state.money,
        locationName: this.state.locationName,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        photos: this.state.photos,
      });
      this.props.saveElement(elementData);
    }

    renderMapView() {
      if (this.state.latitude !== undefined && this.state.longitude !== undefined) {
        return (
          <MapView
            style={styles.mapView}
            showsUserLocation
                    // showsMyLocationButton
            initialRegion={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.0122,
              longitudeDelta: 0.0122,
            }}
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.0122,
              longitudeDelta: 0.0122,
            }}
          >
            <MapView.Marker
              title="Request location"
              coordinate={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
              }}
            />
          </MapView>
        );
      }
      return (
        <View style={styles.emptyMapView}>
          <Text style={styles.emptyMapViewLabel}>Set Location</Text>
        </View>
      );
    }

    render() {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <ErrorPanel testId="misc error" errorMessage={this.props.errors.miscError} messageUnderView={false} />
            <ErrorPanel testId="post error" errorMessage={this.props.errors.postError}>
              <TextInput
                maxLength={2500}
                placeholder="Post"
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
                    placeholder="How much are you expecting ?"
                    keyboardType="numeric"
                    style={styles.currencyTextInput}
                    defaultValue={`${this.state.money || ''}`}
                    underlineColorAndroid="transparent"
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
                style={styles.locationPanel}
                onPress={this.showLocationPicker}
                disabled={this.props.submitting}
              >
                {this.renderMapView()}

              </TouchableOpacity>
            </ErrorPanel>
            <ErrorPanel testId="time error" errorMessage={this.props.errors.timeError}>
              <View style={styles.timePanel}>
                <TouchableHighlight
                  style={styles.startTimePanel}
                  onPress={() => this.showDateTimePicker('start')}
                  disabled={this.props.submitting}
                  underlayColor="#EEE"
                >
                  <View>
                    <Text style={styles.timeHeader}>Set Time</Text>
                    {
                          this.state.startTime && (
                          <Text style={styles.timeLabel}>
                            {this.state.startTime ? moment(this.state.startTime).calendar(null, {
                              sameDay: '[Today] LT',
                              nextDay: '[Tomorrow] LT',
                              nextWeek: 'ddd LT',
                              lastDay: '[Yesterday] LT',
                              lastWeek: '[Last] ddd LT',
                              sameElse: 'll LT',
                            }) : ''}
                          </Text>)
                      }
                  </View>
                </TouchableHighlight>
              </View>
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
            style={styles.submitButton}
            onPress={this.submit}
            disabled={this.props.submitting}
            underlayColor="#EEE"
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableHighlight>
          <DateTimePicker
            mode="datetime"
            date={this.state.pickerDate}
            maximumDate={this.state.pickerMaxDate}
            minimumDate={this.state.pickerMinDate}
            isVisible={this.state.isShowingDateTimePicker}
            onConfirm={this.handleSelectedDate}
            onCancel={this.hideDateTimePicker}
          />
          <LocationModal
            onSubmit={this.handleLocationChange}
            modalVisible={this.state.isShowingLocationPicker}
            location={{
              latitude: this.state.latitude || 0,
              longitude: this.state.longitude || 0,
              name: this.state.locationName || '',
            }}
            hideModal={this.hideLocationPicker}
          />
          <Indicator visible={this.props.submitting} />
        </SafeAreaView>
      );
    }
}

ResponseEditorComponent.propTypes = {
  saveElement: PropTypes.func.isRequired,
  response: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default ResponseEditorComponent;
