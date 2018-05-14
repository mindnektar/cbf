import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

export default (mapStateToProps, actions, Component) => (
    withRouter(connect(
        mapStateToProps,
        actions ? dispatch => bindActionCreators(actions, dispatch) : null
    )(Component))
);
