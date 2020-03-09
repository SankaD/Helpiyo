import { StyleSheet } from 'react-native';
import commonStyles from '../styles';

const styles = StyleSheet.create({
  emptyViewContainer: {
    alignSelf: 'stretch',
    backgroundColor: commonStyles.colors.transparent,
  },
  emptyViewLabel1: {
    // fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    color: commonStyles.colors.color_2,
  },
  emptyViewLabel2: {
    padding: 10,
    textAlign: 'center',
    color: commonStyles.colors.color_2,
  },
  emptyViewButton: {
    padding: 20,
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#BCF9FF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    // color: commonStyles.colors.color_6,
  },
});

export default styles;
