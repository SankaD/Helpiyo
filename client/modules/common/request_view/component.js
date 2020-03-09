import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import numeral from 'numeral';
import Carousel from 'react-native-snap-carousel';
import PropTypes from 'prop-types';
import moment from 'moment';
import geolib from 'geolib';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

export default class RequestViewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.paymentPanelVisible = false;
  }

  renderImage(images, item, index) {
    return (
      <TouchableOpacity
        style={styles.imageView}
        onPress={() => {
          this.props.showImage(images, index);
        }}
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
    if (this.props.request.sos) {
      return (<Icon name="alert-octagram" size={16} style={styles.sosIcon} />);
    }
    return (<View />);
  }

  renderImages() {
    if (this.props.request.photos && this.props.request.photos.length > 0) {
      return (
        <View style={styles.imagePanel}>
          <Carousel
            data={this.props.request.photos}
            renderItem={(item, index) => this.renderImage(this.props.request.photos, item, index)}
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
      return (
        <Icon name={this.props.label.icon} color={this.props.label.color} style={styles.label} />
      );
    }
    return null;
  }

  showTags() {
    if (this.props.tagsVisible && this.props.request.tags) {
      return (
        <View style={styles.tagPanel}>
          {
                        this.props.request.tags.map((tag) => {
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

  renderLocation(request) {
    if (!request.locationSet || !request.locationName || !this.props.currentLocation) {
      return null;
    }
    this.paymentPanelVisible = true;
    let distance = geolib.getDistance({
      latitude: request.location.coordinates[1],
      longitude: request.location.coordinates[0],
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

  static renderCurrency(request) {
    if (request.money > 0) {
      return (
        <Text style={styles.currency}>
          {request.money}
          {' '}
          {request.currency}
        </Text>
      );
    }
    return null;
  }

  static renderTime(request) {
    if (!request.startTime && !request.endTime) {
      return (
        <View style={styles.timePanel} />
      );
    }
    return (
      <View style={styles.timePanel}>
        <Text
          style={styles.fromTime}
        >
          {request.startTime ? `From ${moment(request.startTime).local().calendar()}` : ''}
        </Text>
        {/* <Text style={styles.toTime}>{request.endTime ? `To\t\t\t\t${moment(request.endTime).local().calendar()}` : ''}</Text> */}
      </View>
    );
  }

  renderPaymentPanel(request) {
    if (request.money <= 0
            && !request.startTime
            && !request.endTime
            && (!request.locationSet || !request.locationName || !this.props.currentLocation)) {
      return null;
    }

    return (
      <View style={styles.paymentPanel}>
        <View style={styles.metaRightPanel}>
          {RequestViewComponent.renderCurrency(request)}
          {this.renderLocation(request)}
          {RequestViewComponent.renderTime(request)}
        </View>
      </View>
    );
  }

  render() {
    const {
      request, showMenu, showProfile, showElement,
    } = this.props;
    return (
      <View style={styles.view}>
        <View style={styles.topPanel}>
          <TouchableOpacity style={styles.profileData} onPress={() => showProfile(request.createdBy)}>
            <Image
              style={styles.profilePic}
              source={{ uri: request.creator.profilePic }}
              resizeMethod="auto"
              resizeMode="cover"
              borderRadius={20}
            />
            <View style={styles.descPanel}>
              <Text style={styles.heroName}>{request.creator.heroName}</Text>
              <View style={styles.statusPanel}>
                {this.showLabel()}
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.menuPanel}>
            <Text style={styles.createdOn}>{moment(request.createdOn).local().fromNow()}</Text>
            <TouchableOpacity onPress={showMenu}>
              <Icon name="dots-horizontal" size={20} style={styles.moreMenuButton} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.postPanel} onPress={() => showElement(request._id)}>
          <Text style={styles.post}>{request.post}</Text>
        </TouchableOpacity>
        {this.renderPaymentPanel(request)}
        {this.renderImages()}
        {/* {this.showTags()} */}
      </View>
    );
  }
}
RequestViewComponent.propTypes = {
  request: PropTypes.object.isRequired,
  showMenu: PropTypes.func.isRequired,
  showProfile: PropTypes.func.isRequired,
  labelVisible: PropTypes.bool,
  label: PropTypes.object,
  tagsVisible: PropTypes.bool,
  currentLocation: PropTypes.object,
  showImage: PropTypes.func.isRequired,
  showElement: PropTypes.func.isRequired,
};

RequestViewComponent.defaultProps = {
  labelVisible: false,
  tagsVisible: false,
  label: { color: '#000', status: '' },
  currentLocation: null,
};
