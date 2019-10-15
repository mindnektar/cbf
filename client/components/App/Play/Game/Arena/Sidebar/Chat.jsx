import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import uuid from 'uuid';
import GameModel from 'models/play/game';
import TextField from 'atoms/TextField';

const Chat = (props) => {
    const [message, setMessage] = useState('');
    let prevName;

    useEffect(() => {
        if (
            props.data.me
            && props.data.match.messages[0]
            && props.data.match.messages[0].author.id !== props.data.me.id
        ) {
            props.markMessagesRead(props.data.match.id);
        }
    }, [props.data.match.messages]);

    const changeMessage = (event) => {
        setMessage(event.target.value);
    };

    const submitMessage = () => {
        props.createMessage({
            id: props.data.match.id,
            messageId: uuid(),
            text: message,
        });
        setMessage('');
    };

    const renderMessage = (item) => {
        let renderedName = null;

        if (prevName !== item.author.name) {
            prevName = item.author.name;
            renderedName = (
                <div className="cbf-chat__message-author">
                    {item.author.name}
                </div>
            );
        }

        return (
            <div
                className={classNames(
                    'cbf-chat__message',
                    { 'cbf-chat__message--mine': props.data.me && item.author.id === props.data.me.id }
                )}
                key={item.id}
            >
                {renderedName}

                <div className="cbf-chat__message-text">
                    {item.text}

                    <div className="cbf-chat__message-date">
                        {moment(item.createdAt).format('LT')}
                    </div>
                </div>
            </div>
        );
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
                {props.data.match.messages.map(renderMessage)}
            </div>
        </div>
    );
};

Chat.propTypes = {
    data: PropTypes.object.isRequired,
    createMessage: PropTypes.func.isRequired,
    markMessagesRead: PropTypes.func.isRequired,
};

export default withRouter(GameModel.graphql(Chat));
