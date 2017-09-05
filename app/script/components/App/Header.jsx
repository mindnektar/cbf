import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { push } from 'actions/history';

const menuItems = [
    { label: 'Home', route: '', is: path => path === '/' },
    { label: 'Play', route: 'play', is: path => path.includes('play') },
];

class Header extends React.Component {
    changePageHandler = route => () => {
        this.props.push(route);
    }

    render() {
        return (
            <div className="cbf-header">
                <div className="cbf-header__logo">CBF</div>

                <div className="cbf-header__menu">
                    {menuItems.map(item =>
                        <div
                            className={classNames(
                                'cbf-header__menu-item',
                                { 'cbf-header__menu-item--active': item.is(this.props.path) }
                            )}
                            key={item.label}
                            onTouchTap={this.changePageHandler(item.route)}
                        >
                            {item.label}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

Header.propTypes = {
    path: PropTypes.string.isRequired,
    push: PropTypes.func.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        path: ownProps.location.pathname,
    }),
    {
        push,
    },
    Header
);
