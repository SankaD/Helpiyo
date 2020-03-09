import { StyleSheet } from 'react-native';
import commonStyles from '../styles';

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: commonStyles.colors.light_gray,
    borderRadius: 5,
  },
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.label_color,
  },
  pickerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currency: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
  },
  currencyList: {
    backgroundColor: commonStyles.colors.label_color,
    padding: 10,
    borderRadius: 5,
  },
  countryButton: {
    backgroundColor: commonStyles.colors.label_color,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 10,
    // marginTop: 5,
    // marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    height: 50,
  },
  countryPanel: {
    flexDirection: 'row',
  },
  flag: {
    fontSize: 24,
  },
  modalCurrency: {
    fontSize: 24,
    marginLeft: 10,
    width: 60,
    // height: 40,
    alignSelf: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
  },
  currencyName: {
    textAlignVertical: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filter: {
    paddingLeft: 10,
    height: 48,
    flex: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: commonStyles.colors.light_gray,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: commonStyles.colors.label_color,
  },
  backIcon: {
    padding: 5,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
