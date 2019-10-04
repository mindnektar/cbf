import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import OutsideClickHandler from 'react-outside-click-handler';
import { deleteToken, AUTH_TYPE_USER } from 'auth';
import Collapsible from 'molecules/Collapsible';

const UserMenu = (props) => {
    const logout = () => {
        deleteToken(AUTH_TYPE_USER);
        props.history.push('/');
        window.location.reload();
    };

    const changePageHandler = (route) => () => {
        props.history.push(route);
        props.close();
    };

    return ReactDOM.createPortal((
        <div className="cbf-user-menu">
            <OutsideClickHandler onOutsideClick={props.close}>
                <Collapsible collapsed={!props.isOpen}>
                    <div className="cbf-user-menu__content">
                        <div className="cbf-user-menu__head">
                            {props.me.name}
                        </div>

                        {props.me.isAdmin && (
                            <div
                                className="cbf-user-menu__item"
                                onClick={changePageHandler('/users')}
                            >
                                Users
                            </div>
                        )}

                        <div
                            className="cbf-user-menu__item"
                            onClick={logout}
                        >
                            Logout
                        </div>
                    </div>
                </Collapsible>
            </OutsideClickHandler>
        </div>
    ), document.body);
};

UserMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
};

export default withRouter(UserMenu);
