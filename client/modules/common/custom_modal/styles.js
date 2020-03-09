import { StyleSheet } from 'react-native';
import commonStyles from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.darkTransparentBackground,
  },
  touchableCancel: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'transparent',
    margin: 10,
    flexDirection: 'column',
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  panel2: {
    justifyContent: 'center',
    flex: 1,
  },
  scrollView: {
  },
});

export default styles;
