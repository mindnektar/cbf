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
                this.props.transformers,
                this.props.params,
                this.props.serverActions.includes(this.props.action),
            );
        }
    }

    isActive() {
        return this.props.validators[this.props.action](
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
    action: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired,
    gameId: PropTypes.string.isRequired,
    gameState: PropTypes.object.isRequired,
    params: PropTypes.array,
    serverActions: PropTypes.array,
    transformers: PropTypes.object.isRequired,
    updateGameState: PropTypes.func.isRequired,
    validators: PropTypes.object.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        gameId: ownProps.match.params.gameId,
        gameState: state.gameStates.states[
            (state.gameStates.stateCountSinceLastLoad - 1) + state.gameStates.actionIndex
        ],
    }),
    {
        updateGameState,
    },
    Action
);
