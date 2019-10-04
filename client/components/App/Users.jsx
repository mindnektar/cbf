import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import UsersModel from 'models/users';
import Button from 'atoms/Button';
import TextField from 'atoms/TextField';
import Form, { FormItem } from 'molecules/Form';
import LoadingContainer from 'molecules/LoadingContainer';

const Users = (props) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (!props.data.loading && (!props.data.me || !props.data.me.isAdmin)) {
            props.history.replace('/');
        }
    }, [props.data.me, props.data.loading]);

    const changeName = (event) => {
        setName(event.target.value);
    };

    const createUser = () => {
        if (!maySubmit()) {
            return;
        }

        props.createUser({ name: name.trim() });
    };

    const maySubmit = () => (
        !!name.trim()
    );

    const renderContent = () => (
        <div className="cbf-users">
            <div className="cbf-users__create">
                <Form>
                    <FormItem label="Username">
                        <TextField
                            onChange={changeName}
                            onSubmit={createUser}
                        >
                            {name}
                        </TextField>
                    </FormItem>

                    <FormItem>
                        <Button
                            onClick={createUser}
                            disabled={!maySubmit()}
                        >
                            Create user
                        </Button>
                    </FormItem>
                </Form>
            </div>

            <div className="cbf-users__list">
                {props.data.users.map((user) => (
                    <div
                        className={classNames(
                            'cbf-users__item',
                            {
                                'cbf-users__item--active': user.active,
                                'cbf-users__item--admin': user.isAdmin,
                            }
                        )}
                        key={user.id}
                    >
                        <div className="cbf-users__name">
                            {user.name}
                        </div>

                        <div className="cbf-users__invite-code">
                            {!user.active && user.inviteCode}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <LoadingContainer>
            {!props.data.loading && renderContent()}
        </LoadingContainer>
    );
};

Users.propTypes = {
    createUser: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(UsersModel.graphql(Users));
