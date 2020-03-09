import { connect } from 'react-redux';
import Component from './component';
import * as actions from './actions';

const mapState = (state) => ({
    miscError: "",
    projects: [],
    profiles: [],
    searching: false,
});

const mapDispatch = (dispatch) => ({
    search: text => dispatch(actions.search(text))
});

export default connect(mapState, mapDispatch)(Component);