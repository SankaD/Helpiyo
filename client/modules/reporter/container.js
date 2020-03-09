import { connect } from 'react-redux';
import * as actions from './actions';

import component from './component';

const mapState = state => ({
  elementId: state.modules.reporter.elementId,
  elementType: state.modules.reporter.elementType,
});

const mapDispatch = dispatch => ({
  report: (elementId, comment, category, elementType) => dispatch(actions.report(elementId, comment, category, elementType)),
});

export default connect(mapState, mapDispatch)(component);
