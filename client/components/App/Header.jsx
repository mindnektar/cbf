import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

const menuItems = [
    { label: 'Home', route: '/', is: (path) => path === '/' },
    { label: 'Play', route: '/play', is: (path) => path.includes('play') },
];

class Header extends React.Component {
    changePageHandler = (route) => () => {
        this.props.history.push(route);
    }

    render() {
        return (
            <div className="cbf-header">
                <div className="cbf-header__logo">CBF</div>

                <div className="cbf-header__menu">
                    {menuItems.map((item) => (
                        <div
                            className={classNames(
                                'cbf-header__menu-item',
                                { 'cbf-header__menu-item--active': item.is(this.props.history.location.pathname) }
                            )}
                            key={item.label}
                            onClick={this.changePageHandler(item.route)}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>

                {this.props.isSystemLoaded && (
                    <div className="cbf-header__login">
                        {this.props.me ? (
                            <div
                                className={classNames(
                                    'cbf-header__menu-item',
                                    { 'cbf-header__menu-item--active': this.props.history.location.pathname.includes('login') }
                                )}
                                onClick={this.props.logout}
                            >
                                {this.props.me.username}
                            </div>
                        ) : (
                            <div
                                className={classNames(
                                    'cbf-header__menu-item',
                                    { 'cbf-header__menu-item--active': this.props.history.location.pathname.includes('login') }
                                )}
                                onClick={this.changePageHandler('login')}
                            >
                                Login
                            </div>
                        )}
                    </div>
                )}
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
    history: PropTypes.object.isRequired,
};

export default withRouter(Header);
