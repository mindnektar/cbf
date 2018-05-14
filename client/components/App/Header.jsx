import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { logout } from 'actions/auth';
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

                {this.props.isSystemLoaded &&
                    <div className="cbf-header__login">
                        {this.props.me &&
                            <div
                                className={classNames(
                                    'cbf-header__menu-item',
                                    { 'cbf-header__menu-item--active': this.props.path.includes('login') }
                                )}
                                onTouchTap={this.props.logout}
                            >
                                {this.props.me.username}
                            </div>
                        }

                        {!this.props.me &&
                            <div
                                className={classNames(
                                    'cbf-header__menu-item',
                                    { 'cbf-header__menu-item--active': this.props.path.includes('login') }
                                )}
                                onTouchTap={this.changePageHandler('login')}
                            >
                                Login
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }
}

Header.defaultProps = {
    me: null,
};

Header.propTypes = {
    isSystemLoaded: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
    me: PropTypes.object,
    path: PropTypes.string.isRequired,
    push: PropTypes.func.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        isSystemLoaded: state.ui.isSystemLoaded,
        me: state.me,
        path: ownProps.location.pathname,
    }),
    {
        logout,
        push,
    },
    Header
);
