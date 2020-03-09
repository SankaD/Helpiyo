import { StyleSheet } from 'react-native';
import commonStyles from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    backgroundColor: commonStyles.colors.formBackground,
    borderRadius: 10,
    padding: 10,
  },
  locationText: {},
  commentText: {
    backgroundColor: commonStyles.colors.label_color,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
    height: 48,
  },
  heading: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: commonStyles.colors.label_color,
    marginBottom: 20,
  },
  button: {
    borderStyle: 'solid',
    borderRadius: 5,
    backgroundColor: commonStyles.colors.ok_button_color,
    height: 48,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: commonStyles.colors.label_color,
    fontWeight: 'bold',
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: commonStyles.colors.gray,
    height: 200,
    marginTop: 10,
    marginBottom: 10,
    // borderRadius: 10,
  },

});

export default { ...commonStyles, ...styles };
