import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';

class LocalAction extends React.Component {
    onTouchTap = (event) => {
        if (this.props.active) {
            this.props.onTouchTap(event);
        }
    }

    render() {
        const helperClassNames = classNames(
            'cbf-helper-action',
            {
                'cbf-helper-action--active': this.props.active,
                'cbf-helper-action--selected': this.props.selected,
            }
        );

        if (!this.props.children.props.className) {
            return (
                <div
                    className={helperClassNames}
                    onTouchTap={this.onTouchTap}
                >
                    {this.props.children}
                </div>
            );
        }

        return React.cloneElement(
            this.props.children,
            {
                className: `${this.props.children.props.className} ${helperClassNames}`,
                onTouchTap: this.onTouchTap,
            }
        );
    }
}

LocalAction.defaultProps = {
    selected: false,
};

LocalAction.propTypes = {
    active: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onTouchTap: PropTypes.func.isRequired,
    selected: PropTypes.bool,
};

export default connectWithRouter(
    null,
    null,
    LocalAction
);