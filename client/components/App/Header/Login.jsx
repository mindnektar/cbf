import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import OutsideClickHandler from 'react-outside-click-handler';
import { setToken, AUTH_TYPE_USER, RENEWAL_TYPE_USER } from 'auth';
import handleErrors from 'helpers/handleErrors';
import LoginModel from 'models/login';
import Form, { FormItem, FormError } from 'molecules/Form';
import Collapsible from 'molecules/Collapsible';
import Button from 'atoms/Button';
import TextField from 'atoms/TextField';

const Login = (props) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [generalError, setGeneralError] = useState(null);

    const changeName = (event) => {
        setName(event.target.value);
    };

    const changePassword = (event) => {
        setPassword(event.target.value);
    };

    const close = () => {
        setGeneralError(null);
        props.close();
    };

    const maySubmit = () => (
        !!name.trim() && !!password
    );

    const login = async () => {
        if (!maySubmit()) {
            return;
        }

        setGeneralError(null);

        try {
            const { data } = await props.login({
                name: name.trim(),
                password,
            });

            setToken(AUTH_TYPE_USER, data.login.authToken);
            setToken(RENEWAL_TYPE_USER, data.login.renewalToken);

            window.location.reload();
        } catch (error) {
            handleErrors(error, {
                InvalidCredentialsError: () => (
                    setGeneralError('Your email or password is invalid.')
                ),
            });
        }
    };

    return ReactDOM.createPortal((
        <div className="cbf-login">
            <OutsideClickHandler onOutsideClick={close}>
                <Collapsible collapsed={!props.isOpen}>
                    <div className="cbf-login__content">
                        <Form>
                            <FormItem label="Username">
                                <TextField
                                    onChange={changeName}
                                    onSubmit={login}
                                >
                                    {name}
                                </TextField>
                            </FormItem>

                            <FormItem label="Password">
                                <TextField
                                    onChange={changePassword}
                                    onSubmit={login}
                                    type="password"
                                >
                                    {password}
                                </TextField>
                            </FormItem>

                            <FormError>{generalError}</FormError>

                            <FormItem>
                                <Button
                                    onClick={login}
                                    disabled={!maySubmit()}
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
};

export default LoginModel.graphql(Login);
