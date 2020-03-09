import { connect } from 'react-redux';
import component from './component';
import * as actions from './actions';
import { inviteFriends } from '../home/more/actions';

const mapState = state => ({
});

const mapDispatch = dispatch => ({
  gotoSignIn: () => dispatch(actions.gotoSignIn()),
});

export default connect(mapState, mapDispatch)(component);
