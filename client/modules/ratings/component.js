import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableHighlight,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import StarRating from 'react-native-star-rating';
import { Answers } from 'react-native-fabric';
import PropTypes from 'prop-types';
import styles from './styles';
import ErrorPanel from '../common/error_panel/component';
import Logger from '../utils/logger';
import commonStyles from '../common/styles';

export default class RatingViewComponent extends Component {
    static navigationOptions = {
      title: 'Rate',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };

    constructor(props) {
      super(props);
      this.state = {
        rating: this.props.rating,
        comment: this.props.comment,
      };
      this.saveRating = this.saveRating.bind(this);
    }

    componentDidMount() {
      Answers.logCustom('load-page', { name: 'rating-page' });
    }

    componentDidUpdate() {
      if (this.props.goBack) {
        this.props.navigation.goBack();
      }
    }

    saveRating() {
      Logger.info(`saving rating : ${this.props.elementType}`);
      if (this.props.elementType === 'request') {
        this.props.completeRequest(this.props.elementId, this.state.rating, this.state.comment);
      } else if (this.props.elementType === 'response') {
        this.props.completeResponse(this.props.elementId, this.state.rating, this.state.comment);
      } else if (this.props.elementType === 'reject') {
        this.props.rejectResponse(this.props.elementId, this.state.rating, this.state.comment);
      }
    }

    render() {
      return (
        <SafeAreaView style={styles.ratingContainer}>
          <ErrorPanel testId="misc error" messageUnderView={false} errorMessage={this.props.miscError} />
          <ErrorPanel testId="rating error" messageUnderView={false} errorMessage={this.props.ratingError}>
            <View style={styles.starContainer}>
              <StarRating
                maxStars={5}
                showRating
                fullStarColor={commonStyles.colors.color_4}
                emptyStarColor={commonStyles.colors.color_6}
                selectedStar={rating => this.setState({ rating })}
                style={this.ratingBar}
                rating={this.state.rating}
                containerStyle={{ backgroundColor: commonStyles.colors.transparent }}
                // buttonStyle={{ backgroundColor: commonStyles.colors.color_6 }}
                emptyStar="star"
                // starStyle={{ borderColor: commonStyles.colors.color_1 }}
              />
            </View>
          </ErrorPanel>
          <ErrorPanel testId="comment error" messageUnderView={false} errorMessage={this.props.commentError}>
            <TextInput
              style={styles.ratingComment}
              underlineColorAndroid="transparent"
              multiline
              numberOfLines={4}
              defaultValue={this.state.comment}
              onChangeText={text => this.setState({ comment: text })}
              placeholder="Enter any comments..."
            />
          </ErrorPanel>
          <TouchableHighlight
            style={this.props.submitting ? styles.disabledButton : styles.ratingButton}
            onPress={this.saveRating}
            disabled={this.props.submitting}
          >
            <Text style={styles.submitButtonText}>Rate</Text>
          </TouchableHighlight>
        </SafeAreaView>
      );
    }
}

RatingViewComponent.propTypes = {
  completeRequest: PropTypes.func.isRequired,
  completeResponse: PropTypes.func.isRequired,
  rejectResponse: PropTypes.func.isRequired,
  elementType: PropTypes.string.isRequired,
  elementId: PropTypes.string,
  ratingError: PropTypes.string,
  commentError: PropTypes.string,
  miscError: PropTypes.string,
  rating: PropTypes.number.isRequired,
  comment: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  goBack: PropTypes.bool.isRequired,
};

RatingViewComponent.defaultProps = {
  elementId: '',
  ratingError: '',
  commentError: '',
  miscError: '',
};
