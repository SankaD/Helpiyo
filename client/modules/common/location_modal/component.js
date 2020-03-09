/**
 * Created by user on 7/7/2017.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import { Answers } from 'react-native-fabric';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';
import CustomModal from '../custom_modal/component';
import styles from './styles';
import Logger from '../../utils/logger';

export default class LocationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: (this.props.location) ? this.props.location.latitude : 0,
      longitude: (this.props.location) ? this.props.location.longitude : 0,
      name: (this.props.location) ? this.props.location.name : '',
      comments: (this.props.location) ? this.props.location.comments : '',
    };
  }

  componentDidMount() {
    Answers.logCustom('load-page', { name: 'location-modal' });
    if (!this.props.location.name) {
      const setState = this.setState.bind(this);
      navigator.geolocation.getCurrentPosition((location) => {
        setState({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          name: 'My Location',
        });
      }, (error) => {
        Logger.error(error);
      });
    }
  }
  showModal(show) {
    this.modal.showModal(show);
  }

  handlePress() {
    const location = {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      name: this.state.name,
      comments: this.state.comments,
    };
    this.props.onSubmit(location);
    this.props.hideModal();
  }
  _handlePress=this.handlePress.bind(this);
  render() {
    return (
      <CustomModal
        ref={(modal) => {
              this.modal = modal;
            }}
        modalVisible={this.props.modalVisible}
        hideModal={this.props.hideModal}
      >
        <View style={styles.modal}>
          <Text style={styles.heading}>Set Location</Text>
          <GooglePlacesAutocomplete
            placeholder="Search..."
            query={{ key: 'AIzaSyBsVMYm_qlHzdPFKoALaqI23yYF7q4xwOM', language: 'en' }}
            currentLocation
            currentLocationLabel="Current location"
            enableHighAccuracyLocation
            minLength={2}
            autoFocus
            listViewDisplayed={false}
            fetchDetails
            debounce={200}
            nearbyPlacesAPI="GooglePlacesSearch"
            GooglePlacesSearchQuery={{
                  rankby: 'distance',
                }}
            onPress={(data, details) => {
                  this.setState({
                                  latitude: details.geometry.location.lat,
                                  longitude: details.geometry.location.lng,
                                  name: details.formatted_address,
                                });
                }}
            styles={{
                container: {
                    // height: 56,
                    marginBottom: 5,
                    margin: 0,
                    backgroundColor: '#EEE',
                    padding: 0,
                },
                textInputContainer: {
                    height: 48,
                    borderBottomWidth: 0,
                    borderTopWidth: 0,
                    margin: 0,
                    backgroundColor: styles.colors.transparent,
                    padding: 0,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                },
                textInput: {
                    margin: 0,
                    marginTop: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    padding: 0,
                    backgroundColor: styles.colors.label_color,
                    height: 48,
                    flex: 1,
                },
            }}
          />
          <View style={styles.mapContainer}>
            <MapView
              style={styles.mapView}
              showsUserLocation
              showsMyLocationButton
              initialRegion={{
                    latitude: this.props.location.latitude,
                    longitude: this.props.location.longitude,
                    latitudeDelta: 0.0122,
                    longitudeDelta: 0.0122,
                  }}
              region={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    latitudeDelta: 0.0122,
                    longitudeDelta: 0.0122,
                  }}
              followsUserLocation
            >
              <MapView.Marker
                title="Request location"
                draggable
                coordinate={{
                      latitude: this.state.latitude,
                      longitude: this.state.longitude,
                    }}
              />
            </MapView>
          </View>
          <TouchableHighlight
            style={styles.button}
            underlayColor="#EEE"
            onPress={this._handlePress}
          >
            <Text style={styles.loginButtonText}>Submit</Text>
          </TouchableHighlight>
        </View>
      </CustomModal>
    );
  }
}

LocationModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  location: PropTypes.object,
};
LocationModal.defaultProps = {
  location: null,
};
