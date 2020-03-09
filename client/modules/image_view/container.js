import { connect } from 'react-redux';

import component from './component';

const mapState = state => ({
  // uri: state.modules.imageView.uri,
  images: state.modules.imageView.images,
  imageIndex: state.modules.imageView.imageIndex,
});

const mapDispatch = dispatch => ({
});

export default connect(mapState, mapDispatch)(component);
