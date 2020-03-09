import { connect } from 'react-redux';
import SearchView from './component';
import * as actions from './actions';

const mapState = state => ({
  results: state.modules.search.results,
  searchString: state.modules.search.searchString,
  refreshing: state.modules.search.refreshing,
  filter: state.modules.search.filter,
});
const mapDispatch = dispatch => ({
  search: (searchString, filter) => dispatch(actions.search(searchString, filter)),
  onFilterChange: filter => dispatch(actions.changeFilter(filter)),
});

export default connect(mapState, mapDispatch)(SearchView);
