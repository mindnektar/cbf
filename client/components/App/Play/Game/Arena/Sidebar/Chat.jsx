import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import GameModel from 'models/play/game';
import TextField from 'atoms/TextField';

const Chat = (props) => {
    const [message, setMessage] = useState('');

    const changeMessage = (event) => {
        setMessage(event.target.value);
    };

    const submitMessage = () => {
        props.createMessage({
            id: props.data.match.id,
            text: message,
        });
        setMessage('');
    };

    return (
        <div className="cbf-chat">
            <TextField
                onChange={changeMessage}
                onSubmit={submitMessage}
            >
                {message}
            </TextField>

            <div className="cbf-chat__content">
                {props.data.match.messages.map((item) => (
                    <div
                        className={classNames(
                            'cbf-chat__message',
                            { 'cbf-chat__message--mine': item.author.id === props.data.me.id }
                        )}
                        key={item.id}
                    >
                        <div className="cbf-chat__message-author">
                            {item.author.name}
                        </div>

                        <div className="cbf-chat__message-text">
                            {item.text}
                        </div>

                        <div className="cbf-chat__message-date">
                            {moment(item.createdAt).format('L LT')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

Chat.propTypes = {
    data: PropTypes.object.isRequired,
    createMessage: PropTypes.func.isRequired,
};

export default withRouter(GameModel.graphql(Chat));
