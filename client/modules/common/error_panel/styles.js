import { StyleSheet } from 'react-native';
import commonStyles from '../styles';

const styles = StyleSheet.create({
  panel: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'transparent',
    borderRadius: 5,
  },
  message: {
    backgroundColor: '#F66',
    padding: 10,
    color: '#FFF',
    fontWeight: 'bold',
  },
  errorDownView: {
    backgroundColor: '#F66',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  errorUpView: {
    backgroundColor: '#F66',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
});

export default { ...commonStyles.styles, ...styles };
