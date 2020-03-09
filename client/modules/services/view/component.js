import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import numeral from 'numeral';
import geolib from 'geolib';
import Carousel from 'react-native-snap-carousel';
import PropTypes from 'prop-types';
import moment from 'moment';
import ServiceMenu from '../service_menu/container';
import styles from './styles';
import EmptyView from '../../common/empty_view/component';
import RequestViewComponent from '../../common/request_view/component';
import commonStyles from '../../common/styles';
import { Answers } from 'react-native-fabric';

export default class ServiceViewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false,
    };
    this.paymentPanelVisible = false;
    this.showMenu = this.showMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
  }
  showMenu() {
    this.setState({ menuVisible: true });
  }

  hideMenu() {
    this.setState({ menuVisible: false });
  }

  renderImage(images, item, index) {
    return (
      <TouchableOpacity
        style={styles.imageView}
        onPress={() => { this.props.showImage(images, index); }}
      >
        <Image
          source={{ uri: item.item.thumbnail || item.item.url }}
          style={styles.image}
          defaultSource={require('../../../images/placeholder_image.jpg')}
          resizeMethod="auto"
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }

  renderSosIcon() {
    if (this.props.service.sos) {
      return (<Icon name="alert-octagram" size={16} style={styles.sosIcon} />);
    }
    return (<View />);
  }

  renderImages() {
    if (this.props.service.photos && this.props.service.photos.length > 0) {
      return (
        <View style={styles.imagePanel}>
          <Carousel
            data={this.props.service.photos}
            renderItem={(item, index) => this.renderImage(this.props.service.photos, item, index)}
            sliderWidth={400}
            itemWidth={200}
            layout="default"
            style={styles.carousel}
          />
        </View>
      );
    }
    return null;
  }

  showLabel() {
    if (this.props.labelVisible && this.props.label.status !== '') {
      return (<Text style={[styles.label, { backgroundColor: `${this.props.label.color}` }]}>{this.props.label.status}</Text>);
    }
    return null;
  }

  showTags() {
    if (this.props.tagsVisible && this.props.service.tags) {
      return (
        <View style={styles.tagPanel}>
          {
              this.props.service.tags.map((tag) => {
                if (tag.toLowerCase() === 'sos') {
                  return null;
                }
                return (
                  <TouchableOpacity style={styles.tag} key={tag}>
                    <View style={styles.tagView}>
                      <Text style={styles.tagLabel}>{tag}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            }

        </View>
      );
    }
    return null;
  }

  renderLocation(service) {
    if (!service.locationSet || !service.locationName || !this.props.currentLocation) {
      return null;
    }
    this.paymentPanelVisible = true;
    let distance = geolib.getDistance({
      latitude: service.location.coordinates[1],
      longitude: service.location.coordinates[0],
    }, this.props.currentLocation);
    let unit = 'm';
    let string = '';
    if (distance < 1) {
      string = 'Here';
    } else if (distance < 1000) {
      string = `${numeral(distance).format('0') + unit} away`;
    } else if (distance > 100 * 1000) {
      string = 'far away';
    } else if (distance >= 1000) {
      distance /= 1000;
      unit = 'km';
      string = `${numeral(distance).format('0') + unit} away`;
    }
    return (
      <View style={styles.locationPanel}>
        <Icon name="map-marker" size={20} style={styles.locationIcon} />
        <Text style={styles.locationText}>{string}</Text>
      </View>
    );
  }

  static getServiceStatus(service) {
    const icon = commonStyles.icons.service;
    if (service.status === 'active') {
      return { status: 'Open', color: commonStyles.colors.activeElement, icon };
    } if (service.status === 'inactive') {
      return { status: 'Accepted', color: commonStyles.colors.inactiveElement, icon };
    }
    return { status: '', color: commonStyles.colors.color_0 };
  }

  static renderCurrency(service) {
    if (service.money > 0) {
      return (
        <Text style={styles.currency}>
          {service.money}
          {' '}
          {service.currency}
        </Text>
      );
    }
    return null;
  }

  static renderTime(service) {
    if (!service.startTime && !service.endTime) {
      return (
        <View style={styles.timePanel} />
      );
    }
    return (
      <View style={styles.timePanel}>
        <Text style={styles.fromTime}>{service.startTime ? `From\t\t${moment(service.startTime).local().calendar()}` : ''}</Text>
        <Text style={styles.toTime}>{service.endTime ? `To\t\t\t\t${moment(service.endTime).local().calendar()}` : ''}</Text>
      </View>
    );
  }

  renderPaymentPanel(service) {
    if (service.money <= 0
        && !service.startTime
        && !service.endTime
        && (!service.locationSet || !service.locationName || !this.props.currentLocation)) {
      return null;
    }

    return (
      <View style={styles.paymentPanel}>
        {ServiceViewComponent.renderTime(service)}
        <View style={styles.metaRightPanel}>
          {this.renderLocation(service)}
          {ServiceViewComponent.renderCurrency(service)}
        </View>
      </View>
    );
  }

  renderFirstButton(service) {
    if (service.createdBy === this.props.currentProfileId) {
      return (
        <View style={styles.button}>
          <Icon.Button
            name="human-greeting"
            size={24}
            style={styles.responseButton}
            backgroundColor={styles.colors.color_6}
            color={styles.colors.feed_button_text}
            onPress={() => this.props.showRequests(service._id)}
          />
        </View>
      );
    }
    return (
      <View style={styles.button}>
        <Icon.Button
          name="human-greeting"
          size={24}
          style={styles.responseButton}
          backgroundColor={styles.colors.color_6}
          color={service.requestId ? styles.colors.light_gray : styles.colors.feed_button_text}
          disabled={!!service.requestId}
          onPress={() => this.props.createRequest(service._id)}
        />
      </View>
    );
  }

  toggleService(serviceId, status) {
    let title = '';
    let desc = '';
    if (status === 'active') {
      title = 'Disable service';
      desc = 'Are you sure you want to disable this service ?';
    } else if (status === 'inactive') {
      title = 'Enable service';
      desc = 'Are you sure you want to enable this service ?';
    }
    Alert.alert(
      title,
      desc, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.toggleService(serviceId);
          },
        },
      ],
    );
  }

  renderThirdButton(service) {
    if (service.createdBy === this.props.currentProfileId) {
      return (
        <View style={styles.button}>
          <Icon.Button
            name={service.status === 'active' ? 'close-circle-outline' : 'check-circle-outline'}
            size={24}
            style={styles.commentButton}
            backgroundColor="#FFFFFF"
            color={service.status === 'active' ? styles.colors.red : styles.colors.green}
            // disabled={service.status === 'completed'}
            onPress={() => this.toggleService(service._id, service.status)}
          />
        </View>
      );
    }
    const disabled = (this.props.inPromotion || []).includes(this.props.service._id) || service.status === 'inactive';
    return (
      <View style={styles.button}>
        <Icon.Button
          name={service.promoted ? 'heart' : 'heart-outline'}
          size={24}
          style={styles.promoteButton}
          backgroundColor={styles.colors.color_6}
          color={disabled ? styles.colors.light_gray : (service.promoted ? styles.colors.pink : styles.colors.feed_button_text)}
          onPress={() => this.props.promote(service._id)}
          disabled={disabled}
        />
      </View>
    );
  }

  render() {
    const {
      service, showProfile, showImage, showElement,
    } = this.props;
    return (
      <SafeAreaView style={styles.view}>
        <RequestViewComponent
          request={service}
          showMenu={this.showMenu}
          showProfile={showProfile}
          showImage={showImage}
          label={ServiceViewComponent.getServiceStatus(service)}
          labelVisible
          tagsVisible
          showElement={showElement}
          currentLocation={this.props.currentLocation}
        />
        <View style={styles.buttonPanel}>
          {this.renderFirstButton(service)}
          <View style={styles.button}>
            <Icon.Button
              name="comment-outline"
              size={24}
              style={styles.commentButton}
              backgroundColor={styles.colors.color_6}
              color={styles.colors.feed_button_text}
              onPress={() => this.props.showComments(service._id)}
            />
          </View>
          {this.renderThirdButton(service)}
        </View>
        <ServiceMenu
          service={service}
          visible={this.state.menuVisible}
          isMyService={service.createdBy === this.props.currentProfileId}
          hideMenu={this.hideMenu}
        />
      </SafeAreaView>
    );
  }
}
ServiceViewComponent.propTypes = {
  service: PropTypes.object.isRequired,
  showProfile: PropTypes.func.isRequired,
  showComments: PropTypes.func.isRequired,
  labelVisible: PropTypes.bool,
  label: PropTypes.object,
  tagsVisible: PropTypes.bool,
  currentLocation: PropTypes.object.isRequired,
  showImage: PropTypes.func.isRequired,
  currentProfileId: PropTypes.string.isRequired,
  showRequests: PropTypes.func.isRequired,
  toggleService: PropTypes.func.isRequired,
  promote: PropTypes.func.isRequired,
  inPromotion: PropTypes.array.isRequired,
  showElement: PropTypes.func.isRequired,
  createRequest: PropTypes.func.isRequired,
};

ServiceViewComponent.defaultProps = {
  labelVisible: false,
  tagsVisible: false,
  label: { color: '#000', status: '' },
  currentLocation: null,
};
