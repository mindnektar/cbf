import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import HeaderModel from 'models/header';
import Login from './Header/Login';
import UserMenu from './Header/UserMenu';

const Header = (props) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const menuItems = [
        { label: 'Home', route: '/', is: (path) => path === '/' },
        { label: 'Play', route: '/play', is: (path) => path.includes('play') },
    ];

    const changePageHandler = (route) => () => {
        props.history.push(route);
    };

    const openLogin = () => {
        setIsLoginOpen(true);
    };

    const closeLogin = () => {
        setIsLoginOpen(false);
    };

    const openUserMenu = () => {
        setIsUserMenuOpen(true);
    };

    const closeUserMenu = () => {
        setIsUserMenuOpen(false);
    };

    return (
        <div className="cbf-header">
            <div className="cbf-header__logo">
                <span>C</span>
                <span>B</span>
                <span>F</span>
            </div>

            <div className="cbf-header__menu">
                {menuItems.map((item) => (
                    <div
                        className={classNames(
                            'cbf-header__menu-item',
                            { 'cbf-header__menu-item--active': item.is(props.history.location.pathname) }
                        )}
                        key={item.label}
                        onClick={changePageHandler(item.route)}
                    >
                        {item.label}
                    </div>
                ))}
            </div>

            {!props.data.loading && (
                <div className="cbf-header__login">
                    {props.data.me ? (
                        <>
                            <div
                                className="cbf-header__menu-item"
                                onClick={openUserMenu}
                            >
                                {props.data.me.name}
                            </div>

                            <UserMenu
                                isOpen={isUserMenuOpen}
                                close={closeUserMenu}
                                me={props.data.me}
                            />
                        </>
                    ) : (
                        <>
                            <div
                                className="cbf-header__menu-item"
                                onClick={changePageHandler('signup')}
                            >
                                Signup
                            </div>

                            <div
                                className="cbf-header__menu-item"
                                onClick={openLogin}
                            >
                                Login
                            </div>

                            <Login
                                isOpen={isLoginOpen}
                                close={closeLogin}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

Header.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default HeaderModel.graphql(withRouter(Header));
