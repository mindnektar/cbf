import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { handleGameActions } from 'actions/games';
import Button from 'Button';

class Status extends React.Component {
    endTurn = () => {
        this.props.handleGameActions(
            this.props.gameId,
            [
                ...this.props.actions,
                [this.props.endTurnAction, []],
            ]
        );
    }

    render() {
        return (
            <div className="cbf-helper-status">
                <div className="cbf-helper-status__text">
                    {this.props.children}
                </div>

                <div className="cbf-helper-status__options">
                    <Button
                        disabled
                        onTouchTap={() => null}
                        secondary
                    >
                        Undo
                    </Button>

                    <Button
                        disabled
                        onTouchTap={() => null}
                        secondary
                    >
                        Redo
                    </Button>

                    <Button
                        disabled={!this.props.mayEndTurn}
                        onTouchTap={this.endTurn}
                        secondary
                    >
                        End turn
                    </Button>
                </div>
            </div>
        );
    }
}

Status.propTypes = {
    actions: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    endTurnAction: PropTypes.number.isRequired,
    handleGameActions: PropTypes.func.isRequired,
    gameId: PropTypes.string.isRequired,
    mayEndTurn: PropTypes.bool.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        actions: state.gameStates.actions,
        gameId: ownProps.match.params.gameId,
    }),
    {
        handleGameActions,
    },
    Status
);
