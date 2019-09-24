import React from 'react';
import PropTypes from 'prop-types';
import Form, { FormItem } from 'Form';
import Button from 'Button';
import TextField from 'TextField';

class Login extends React.Component {
    state = {
        password: '',
        username: '',
    };

    changeUsername = (event) => {
        this.setState({ username: event.target.value });
    }

    changePassword = (event) => {
        this.setState({ password: event.target.value });
    }

    login = () => {
        this.props.login(this.state.username, this.state.password);
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
                            {this.state.username}
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
};

export default Login;
