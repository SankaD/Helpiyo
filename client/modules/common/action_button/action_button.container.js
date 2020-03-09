import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import ActionButton from './action_button.component';
import { openRequestCreator, openSosCreator, openServiceCreator } from './action_button.actions';

const mapState = state => ({});

const mapDispatch = dispatch => ({
  openRequestCreator: () => dispatch(openRequestCreator()),
  openSosCreator: () => dispatch(openSosCreator()),
  showEventCreator: () => dispatch(NavigationActions.navigate({ routeName: 'EventCreator', key: 'EventCreator' })),
  showMessageComposer: () => dispatch(NavigationActions.navigate({ routeName: 'MessageComposer', key: 'MessageComposer' })),
  openServiceCreator: () => dispatch(openServiceCreator()),
});

export default connect(mapState, mapDispatch)(ActionButton);
