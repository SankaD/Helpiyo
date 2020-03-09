import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  ratingContainer: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    // alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 10,
    borderRadius: 5,
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
  starContainer: {
    backgroundColor: '#FFFFFF',
  },
  ratingBar: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',

  },
  ratingButton: {
    margin: 10,
    alignSelf: 'center',
  },
});

export default styles;
