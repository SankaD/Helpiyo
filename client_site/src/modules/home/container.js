import {connect} from 'react-redux';
import * as actions from './actions';
import Component from './component';

const mapState = ({state}) => ({});
const mapDispatch = ({dispatch}) => ({
    loadElement: (type, id) => dispatch(actions.loadElement(type, id))
});

export default connect(mapState, mapDispatch)(Component);