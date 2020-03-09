import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  ratingContainer: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    // alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 10,
  },
  ratingTitle: {
    fontSize: 20,
    paddingBottom: 10,
    alignSelf: 'center',
  },
  ratingComment: {
    backgroundColor: '#EEEEEE',
    marginTop: 10,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  ratingBar: {
    alignSelf: 'center',
  },
  ratingButton: {
    margin: 10,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: commonStyles.colors.color_1,
  },
  list: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  emptyViewContainer: {
    backgroundColor: commonStyles.colors.label_color,
  },
  emptyViewLabel1: {
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    color: '#222',
  },
  emptyViewLabel2: {
    padding: 10,
    textAlign: 'center',
    color: '#555',
  },
  emptyViewButton: {
    // backgroundColor: '#EEF',
    padding: 20,
    borderRadius: 5,
  },
  listFooter: {
    height: 120,
    backgroundColor: commonStyles.colors.transparent,
  },
});

export default { ...styles, ...commonStyles };
