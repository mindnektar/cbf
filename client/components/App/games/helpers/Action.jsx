import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import performAction from 'helpers/performAction';
import GameModel from 'models/play/game';

const Action = (props) => {
    if (props.disabled) {
        return props.children;
    }

    const [style, setStyle] = useState(null);
    const childRef = useRef();
    const state = props.data.match.states[props.data.match.stateIndex];
    const isActive = props.action.isValid({
        state,
        player: props.data.me,
        payload: props.payload,
    });

    useEffect(() => {
        const childRect = childRef.current.getBoundingClientRect();
        const gameRect = document.querySelector('.cbf-arena__canvas').getBoundingClientRect();

        setStyle({
            left: childRect.left - gameRect.left,
            top: childRect.top - gameRect.top,
            width: childRect.width,
            height: childRect.height,
        });
    }, []);

    const onClick = () => {
        if (isActive) {
            performAction({
                match: props.data.match,
                action: props.action,
                payload: props.payload,
                player: props.data.me,
                pushActions: props.pushActions,
                performAction: props.performAction,
            });
        }
    };

    return (
        <>
            {React.cloneElement(props.children, { ref: childRef })}

            {style && ReactDOM.createPortal((
                <div
                    className={classNames(
                        'cbf-helper-action',
                        { 'cbf-helper-action--active': isActive }
                    )}
                    onClick={onClick}
                    style={style}
                />
            ), document.querySelector('.cbf-helper-game'))}
        </>
    );
};

Action.defaultProps = {
    payload: [],
    disabled: false,
};

Action.propTypes = {
    action: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    match: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    payload: PropTypes.array,
    pushActions: PropTypes.func.isRequired,
    performAction: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default withRouter(GameModel.graphql(Action));
