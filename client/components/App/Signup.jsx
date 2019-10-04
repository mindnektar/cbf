import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { setToken, AUTH_TYPE_USER } from 'auth';
import SignupModel from 'models/signup';
import Form, { FormItem } from 'molecules/Form';
import Button from 'atoms/Button';
import TextField from 'atoms/TextField';

const Signup = (props) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [inviteCode, setInviteCode] = useState('');

    useEffect(() => {
        if (!props.data.loading && props.data.me) {
            props.history.replace('/');
        }
    }, [props.data.me]);

    const changeName = (event) => {
        setName(event.target.value);
    };

    const changePassword = (event) => {
        setPassword(event.target.value);
    };

    const changeEmail = (event) => {
        setEmail(event.target.value);
    };

    const changeInviteCode = (event) => {
        setInviteCode(event.target.value);
    };

    const maySubmit = () => (
        !!name.trim() && !!password && !!email.trim() && !!inviteCode
    );

    const signup = async () => {
        if (!maySubmit()) {
            return;
        }

        const { data } = await props.confirmUser({
            name: name.trim(),
            password,
            email: email.trim(),
            inviteCode,
        });

        setToken(AUTH_TYPE_USER, data.confirmUser.authToken);

        props.history.replace('/');
        window.location.reload();
    };

    return (
        <div className="cbf-signup">
            <Form>
                <FormItem label="Username">
                    <TextField
                        onChange={changeName}
                        onSubmit={signup}
                    >
                        {name}
                    </TextField>
                </FormItem>

                <FormItem label="Password">
                    <TextField
                        onChange={changePassword}
                        onSubmit={signup}
                        type="password"
                    >
                        {password}
                    </TextField>
                </FormItem>

                <FormItem label="E-mail address">
                    <TextField
                        onChange={changeEmail}
                        onSubmit={signup}
                        type="email"
                    >
                        {email}
                    </TextField>
                </FormItem>

                <FormItem label="Invite code">
                    <TextField
                        onChange={changeInviteCode}
                        onSubmit={signup}
                        maxLength={4}
                    >
                        {inviteCode}
                    </TextField>
                </FormItem>

                <FormItem>
                    <Button
                        onClick={signup}
                        disabled={!maySubmit()}
                    >
                        Sign up
                    </Button>
                </FormItem>
            </Form>
        </div>
    );
};

Signup.propTypes = {
    confirmUser: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
};

export default withRouter(SignupModel.graphql(Signup));
