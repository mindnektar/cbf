import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { updateGameState } from 'actions/games';

class Action extends React.Component {
    onTouchTap = () => {
        if (this.isActive()) {
            this.props.updateGameState(
                this.props.gameId,
                this.props.action,
                this.props.params,
            );
        }
    }

    isActive() {
        return this.props.action.isValid(
            this.props.gameState, this.props.params
        );
    }

    render() {
        const helperClassNames = classNames(
            'cbf-helper-action',
            { 'cbf-helper-action--active': this.isActive() }
        );

        if (!this.props.children.props.className) {
            return (
                <div
                    className={helperClassNames}
                    onTouchTap={this.onTouchTap}
                >
                    {this.props.children}
                </div>
            );
        }

        return React.cloneElement(
            this.props.children,
            {
                className: `${this.props.children.props.className} ${helperClassNames}`,
                onTouchTap: this.onTouchTap,
            }
        );
    }
}

Action.defaultProps = {
    params: [],
    serverActions: [],
};

Action.propTypes = {
    action: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    gameId: PropTypes.string.isRequired,
    gameState: PropTypes.object.isRequired,
    params: PropTypes.array,
    updateGameState: PropTypes.func.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        gameId: ownProps.match.params.gameId,
        gameState: state.gameStates.states[state.gameStates.currentState],
    }),
    {
        updateGameState,
    },
    Action
);
