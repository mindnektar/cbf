import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import OutsideClickHandler from 'react-outside-click-handler';
import { setToken, AUTH_TYPE_USER } from 'auth';
import LoginModel from 'models/login';
import Form, { FormItem } from 'molecules/Form';
import Collapsible from 'molecules/Collapsible';
import Button from 'atoms/Button';
import TextField from 'atoms/TextField';

const Login = (props) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const changeUsername = (event) => {
        setName(event.target.value);
    };

    const changePassword = (event) => {
        setPassword(event.target.value);
    };

    const login = async () => {
        const { data } = await props.login({ name, password });

        setToken(AUTH_TYPE_USER, data.login.authToken);

        props.history.push('/');
        window.location.reload();
    };

    return ReactDOM.createPortal((
        <div className="cbf-login">
            <OutsideClickHandler onOutsideClick={props.close}>
                <Collapsible collapsed={!props.isOpen}>
                    <div className="cbf-login__content">
                        <Form>
                            <FormItem>
                                <TextField
                                    onChange={changeUsername}
                                    onSubmit={login}
                                >
                                    {name}
                                </TextField>
                            </FormItem>

                            <FormItem>
                                <TextField
                                    onChange={changePassword}
                                    onSubmit={login}
                                    type="password"
                                >
                                    {password}
                                </TextField>
                            </FormItem>

                            <FormItem>
                                <Button
                                    onClick={login}
                                >
                                    Login
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </Collapsible>
            </OutsideClickHandler>
        </div>
    ), document.body);
};

Login.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(LoginModel.graphql(Login));
