import { StyleSheet } from 'react-native';
import commonStyles from '../../common/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.colors.label_color,
  },
  inputPanel: {
    flexDirection: 'row',
    backgroundColor: commonStyles.colors.color_6,
    height: 48,
    borderRadius: 10,
    margin: 5,
    borderBottomColor: commonStyles.colors.light_gray,
    borderBottomWidth: 1,
  },
  input: {
    backgroundColor: commonStyles.colors.color_6,
    borderRadius: 10,
    flex: 1,
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: 48,
  },
  icon: {
    color: commonStyles.colors.color_1,
  },
  list: {
    backgroundColor: commonStyles.colors.color_6,
  },
  element: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingLeft: 10,
    backgroundColor: `${commonStyles.colors.color_2}FF`,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  elementText: {
    flex: 1,
    color: commonStyles.colors.label_color,
    fontWeight: 'bold',
  },
  removeButton: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    color: commonStyles.colors.label_color,
  },
});

export default styles;
