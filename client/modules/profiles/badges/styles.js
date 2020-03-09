import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.color_1,
  },
  gridView: { flex: 1 },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 160,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: commonStyles.colors.color_2,
    backgroundColor: commonStyles.colors.color_6,
  },
  loadupScreen: {
    // alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadupScreenText: {
    color: '#000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
    // width: 100,
    // height: 100,
    backgroundColor: 'black',
    opacity: 0.6,
  },
  badgeImage: {
    height: 120,
    width: 120,
  },
  badgeDescription: {
    textAlign: 'center',
  },
});

export default styles;

