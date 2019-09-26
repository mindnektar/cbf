import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import GameModel from 'models/play/game';

const Action = (props) => {
    const state = props.data.match.states[props.data.match.stateIndex];
    const isActive = props.action.isValid({
        state,
        player: props.data.me,
        payload: props.payload,
    });

    const onClick = () => {
        if (isActive) {
            props.updateGameState(
                props.match.params.gameId,
                props.action,
                props.payload,
            );
        }
    };

    const helperClassNames = classNames(
        'cbf-helper-action',
        { 'cbf-helper-action--active': isActive }
    );

    if (!props.children.props.className) {
        return (
            <div
                className={helperClassNames}
                onClick={onClick}
            >
                {props.children}
            </div>
        );
    }

    return React.cloneElement(
        props.children,
        {
            className: `${props.children.props.className} ${helperClassNames}`,
            onClick: onClick,
        }
    );
};

Action.defaultProps = {
    payload: [],
};

Action.propTypes = {
    action: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    match: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    payload: PropTypes.array,
};

export default withRouter(GameModel.graphql(Action));
