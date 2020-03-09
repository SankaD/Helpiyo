import { connect } from 'react-redux';
import * as actions from './actions';

import component from './component';

const mapState = state => ({
});
const mapDispatch = dispatch => ({
  showGeneralSettings: () => dispatch(actions.gotoGeneralSettings()),
  showAccountSettings: () => dispatch(actions.gotoAccountSettings()),
  showPrivacySettings: () => dispatch(actions.gotoPrivacySettings()),
  showAboutSettings: () => dispatch(actions.gotoAboutSettings()),

});

export default connect(mapState, mapDispatch)(component);
