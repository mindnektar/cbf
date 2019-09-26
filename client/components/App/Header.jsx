import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { deleteToken, AUTH_TYPE_USER } from 'auth';
import HeaderModel from 'models/header';

const menuItems = [
    { label: 'Home', route: '/', is: (path) => path === '/' },
    { label: 'Play', route: '/play', is: (path) => path.includes('play') },
];

class Header extends React.Component {
    changePageHandler = (route) => () => {
        this.props.history.push(route);
    }

    logout = () => {
        deleteToken(AUTH_TYPE_USER);
        this.props.history.push('/');
        window.location.reload();
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

                {!this.props.data.loading && (
                    <div className="cbf-header__login">
                        {this.props.data.me ? (
                            <div
                                className="cbf-header__menu-item"
                                onClick={this.logout}
                            >
                                {this.props.data.me.name}
                            </div>
                        ) : (
                            <div
                                className={classNames(
                                    'cbf-header__menu-item',
                                    { 'cbf-header__menu-item--active': this.props.history.location.pathname.includes('login') }
                                )}
                                onClick={this.changePageHandler('/login')}
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

Header.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default HeaderModel.graphql(withRouter(Header));
