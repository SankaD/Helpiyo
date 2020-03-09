import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import StarRating from 'react-native-star-rating';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../home/responses/styles';
import ErrorPanel from '../error_panel/component';
import Logger from '../../utils/logger';
import { Answers } from 'react-native-fabric';


export default class RatingViewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      comment: '',
    };
  }
  componentDidMount() {
    Answers.logCustom('load-page', { name: 'rating-modal' });
  }
  saveRating() {
    Logger.info('saving rating');
    this.props.onSaveRating(this.props.id, this.state.rating, this.state.comment);
  }
  render() {
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingTitle}>Response Rating</Text>
        <ErrorPanel testId="misc error" messageUnderView={false} errorMessage={this.props.miscError} />
        <ErrorPanel testId="rating error" messageUnderView={false} errorMessage={this.props.ratingError}>
          <View style={styles.starContainer}>
            <StarRating
              maxStars={5}
              showRating
              selectedStar={rating => this.setState({ rating })}
              style={this.ratingBar}
              rating={this.state.rating}
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
          />
        </ErrorPanel>
        <Icon.Button
          name="check-outline"
          size={24}
          backgroundColor="#FFFFFF"
          color="#3c4c88"
          style={styles.ratingButton}
          onPress={() => this.saveRating()}
        >
                    Submit
        </Icon.Button>
      </View>
    );
  }
}

RatingViewComponent.propTypes = {
  onSaveRating: PropTypes.func.isRequired,
  id: PropTypes.string,
  ratingError: PropTypes.string.isRequired,
  commentError: PropTypes.string.isRequired,
  miscError: PropTypes.string.isRequired,
};

RatingViewComponent.defaultProps = {
  id: '',
};
