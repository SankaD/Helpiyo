import { connect } from 'react-redux';
import * as actions from '../actions';

import component from './component';

const mapState = state => ({
  currentPasswordError: state.modules.settings.currentPasswordError,
  newPasswordError: state.modules.settings.newPasswordError,
  passwordConfirmationError: state.modules.settings.passwordConfirmationError,
  passwordModalVisible: state.modules.settings.passwordModalVisible,
  feedbackModalVisible: state.modules.settings.feedbackModalVisible,
  feedback: state.modules.settings.feedback,
  feedbackError: state.modules.settings.feedbackError,
  phoneModalVisible: state.modules.settings.phoneModalVisible,
  phoneNumberError: state.modules.settings.phoneNumberError,
  phoneNumberRequestSent: state.modules.settings.phoneNumberRequestSent,
});
const mapDispatch = dispatch => ({
  changePassword: (currentPassword, newPassword, confirmation) => dispatch(actions.changePassword(currentPassword, newPassword, confirmation)),
  showPasswordModal: visible => dispatch(actions.showPasswordModal(visible)),
  showFeedbackModal: visible => dispatch(actions.showFeedbackModal(visible)),
  showPhoneModal: visible => dispatch(actions.showPhoneModal(visible)),
  submitFeedback: feedback => dispatch(actions.submitFeedback(feedback)),
  requestPhoneNumberCode: phoneNumber => dispatch(actions.requestPhoneNumberCode(phoneNumber)),
  verifyPhoneNumber: (phoneNumber, code) => dispatch(actions.verifyPhoneNumber(phoneNumber, code)),
  linkWithFacebook: () => dispatch(actions.linkWithFacebook()),
  setInterests: () => dispatch(actions.loadInterestSetter()),
});

export default connect(mapState, mapDispatch)(component);
