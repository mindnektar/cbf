import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { setToken, AUTH_TYPE_USER } from 'auth';
import LoginModel from 'models/login';
import Form, { FormItem } from 'molecules/Form';
import Button from 'atoms/Button';
import TextField from 'atoms/TextField';

class Login extends React.Component {
    state = {
        password: '',
        name: '',
    };

    changeUsername = (event) => {
        this.setState({ name: event.target.value });
    }

    changePassword = (event) => {
        this.setState({ password: event.target.value });
    }

    login = async () => {
        const { data } = await this.props.login({
            name: this.state.name,
            password: this.state.password,
        });

        setToken(AUTH_TYPE_USER, data.login.authToken);

        this.props.history.push('/');
        window.location.reload();
    }

    render() {
        return (
            <div>
                <Form>
                    <FormItem>
                        <TextField
                            onChange={this.changeUsername}
                            onSubmit={this.login}
                        >
                            {this.state.name}
                        </TextField>
                    </FormItem>

                    <FormItem>
                        <TextField
                            onChange={this.changePassword}
                            onSubmit={this.login}
                            type="password"
                        >
                            {this.state.password}
                        </TextField>
                    </FormItem>

                    <FormItem>
                        <Button
                            onClick={this.login}
                        >
                            Login
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

export default LoginModel.graphql(withRouter(Login));
