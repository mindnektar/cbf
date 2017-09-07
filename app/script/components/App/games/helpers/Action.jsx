import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Action extends React.Component {
    onTouchTap = (event) => {
        if (this.props.active) {
            this.props.onTouchTap(event);
        }
    }

    render() {
        return (
            <div
                className={classNames(
                    'cbf-helper-action',
                    { 'cbf-helper-action--active': this.props.active }
                )}
                onTouchTap={this.onTouchTap}
            >
                {this.props.children}
            </div>
        );
    }
}

Action.propTypes = {
    active: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onTouchTap: PropTypes.func.isRequired,
};

export default Action;
