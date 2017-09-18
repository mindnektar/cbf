import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { actions, assets, serverActions, states, transformers, validators } from 'shared/games/five-tribes';
import Action from '../helpers/Action';

class Board extends React.Component {
    getAction() {
        if (this.props.gameState.state === states.SELECT_TILE_FOR_MOVEMENT) {
            return actions.SELECT_TILE_FOR_MOVEMENT;
        }

        return actions.SELECT_TILE_FOR_PLACEMENT;
    }

    render() {
        const action = this.getAction();

        return (
            <div className="five-tribes__board">
                {this.props.gameState.public.game.board.map((row, rowIndex) =>
                    <div
                        className="five-tribes__board-row"
                        key={`row${row[0][0]}`}
                    >
                        {row.map((item, itemIndex) =>
                            <Action
                                action={action}
                                key={item[0]}
                                params={[rowIndex, itemIndex]}
                                serverActions={serverActions}
                                transformers={transformers}
                                validators={validators}
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
                                        {item[1].map((meeple, meepleIndex) =>
                                            <Action
                                                action={actions.KILL_MEEPLE_ON_BOARD}
                                                key={meeple}
                                                params={[rowIndex, itemIndex, meepleIndex]}
                                                serverActions={serverActions}
                                                transformers={transformers}
                                                validators={validators}
                                            >
                                                <div
                                                    className={classNames(
                                                        'five-tribes__meeple',
                                                        `five-tribes__meeple--${assets.meeples[meeple]}`
                                                    )}
                                                    key={meeple}
                                                />
                                            </Action>
                                        )}
                                    </div>

                                    {item[2] !== null &&
                                        <div
                                            className={classNames(
                                                'five-tribes__tile-camel',
                                                `five-tribes__player-${item[2]}`
                                            )}
                                        />
                                    }
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
    gameState: PropTypes.object.isRequired,
};

export default connectWithRouter(
    state => ({
        gameState: state.gameStates.states[
            (state.gameStates.stateCountSinceLastLoad - 1) + state.gameStates.actionIndex
        ],
    }),
    null,
    Board
);
