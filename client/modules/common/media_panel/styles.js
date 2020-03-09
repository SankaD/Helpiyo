import { StyleSheet } from 'react-native';
import commonStyles from '../styles';

const styles = StyleSheet.create({
  imagePanel: {
    borderRadius: 10,
    backgroundColor: commonStyles.colors.dark_gray,
    paddingBottom: 5,
    height: 200,
    // flex:1,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: commonStyles.colors.color_4,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: commonStyles.colors.color_6,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carousel: {
    // flex: 1,
    // margin: 5,
    alignSelf: 'center',
    backgroundColor: '#AAA',
  },
  image: {
    height: 200,
    width: 200,
    margin: 2,
    backgroundColor: commonStyles.colors.color_1,
  },
  closeButton: {
    position: 'absolute',
    zIndex: 2,
    alignSelf: 'flex-end',
  },
  closeButtonIcon: {
    color: '#ee0720',
    padding: 5,
  },
  imageText: {
    backgroundColor: '#EEE',
    color: '#111',
    alignSelf: 'center',
    flex: 1,
    // justifyContent: 'flex-end',
    marginTop: 5,
  },
});

export default { ...styles };
