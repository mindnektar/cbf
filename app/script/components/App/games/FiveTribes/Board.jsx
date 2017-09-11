import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { updateGameState } from 'actions/games';
import { actions, assets, states, transformers, validators } from 'shared/games/five-tribes';
import Action from '../helpers/Action';

class Board extends React.Component {
    maySelectTile = (rowIndex, itemIndex) => (
        validators[actions.SELECT_TILE_FOR_MOVEMENT](this.props.gameState, [rowIndex, itemIndex]) ||
        validators[actions.SELECT_TILE_FOR_PLACEMENT](this.props.gameState, [rowIndex, itemIndex])
    )

    selectTileHandler = (rowIndex, itemIndex) => () => {
        if (this.props.gameState[2] === states.SELECT_TILE_FOR_MOVEMENT) {
            this.props.updateGameState(
                this.props.gameId,
                actions.SELECT_TILE_FOR_MOVEMENT,
                transformers,
                [rowIndex, itemIndex]
            );
        }

        if (this.props.gameState[2] === states.SELECT_TILE_FOR_PLACEMENT) {
            this.props.updateGameState(
                this.props.gameId,
                actions.SELECT_TILE_FOR_PLACEMENT,
                transformers,
                [rowIndex, itemIndex]
            );
        }
    }

    render() {
        const board = this.props.gameState[0][0][0];

        return (
            <div className="five-tribes__board">
                {board.map((row, rowIndex) =>
                    <div
                        className="five-tribes__board-row"
                        key={`row${row[0][0]}`}
                    >
                        {row.map((item, itemIndex) =>
                            <Action
                                active={this.maySelectTile(rowIndex, itemIndex)}
                                key={item[0]}
                                onTouchTap={this.selectTileHandler(rowIndex, itemIndex)}
                            >
                                <div className="five-tribes__tile">
                                    <div
                                        className={classNames(
                                            'five-tribes__tile-value',
                                            `five-tribes__tile-value--${assets.tiles[item[0]].color}`
                                        )}
                                    >
                                        {assets.tiles[item[0]].value}
                                    </div>

                                    <div className="five-tribes__tile-action">
                                        {assets.tiles[item[0]].action}
                                    </div>

                                    <div className="five-tribes__tile-meeples">
                                        {item[1].map(meeple =>
                                            <div
                                                className={classNames(
                                                    'five-tribes__meeple',
                                                    `five-tribes__meeple--${assets.meeples[meeple]}`
                                                )}
                                                key={meeple}
                                            />
                                        )}
                                    </div>
                                </div>
                            </Action>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

Board.propTypes = {
    gameId: PropTypes.string.isRequired,
    gameState: PropTypes.array.isRequired,
    updateGameState: PropTypes.func.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        gameId: ownProps.match.params.gameId,
        gameState: state.gameStates.states[state.gameStates.states.length - 1],
    }),
    {
        updateGameState,
    },
    Board
);
