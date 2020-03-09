import { StyleSheet } from 'react-native';
import commonStyles from '../common/styles';

const styles = StyleSheet.create({
  ratingContainer: {
    backgroundColor: commonStyles.colors.formBackground,
    flex: 1,
    padding: 10,
  },
  ratingTitle: {
    fontSize: 20,
    paddingBottom: 10,
    alignSelf: 'center',
  },
  ratingComment: {
    backgroundColor: commonStyles.colors.label_color,
    margin: 10,
    padding: 5,
    marginTop: 10,
    borderRadius: 10,
    marginBottom: 20,
    height: 120,
    textAlignVertical: 'top',
  },
  starContainer: {
    backgroundColor: commonStyles.colors.lightTransparentBackground,
    padding: 15,
    margin: 10,
    borderRadius: 10,
  },
  ratingBar: {
    alignSelf: 'center',
    backgroundColor: commonStyles.colors.formBackground,
    color: commonStyles.colors.color_6,
  },
  ratingButton: {
    height: 48,
    backgroundColor: commonStyles.colors.ok_button_color,
    marginTop: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  disabledButton: {
    height: 48,
    backgroundColor: commonStyles.colors.gray,
    marginTop: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  submitButtonText: {
    color: commonStyles.colors.label_color,
    fontWeight: 'bold',
  },
});

export default styles;
