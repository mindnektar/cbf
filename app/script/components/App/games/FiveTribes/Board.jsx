import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { assets } from 'shared/games/five-tribes';

class Board extends React.Component {
    render() {
        const board = this.props.gameState[0][0][0];

        return (
            <div className="five-tribes__board">
                {board.map(row =>
                    <div
                        className="five-tribes__board-row"
                        key={`row${row[0][0]}`}
                    >
                        {row.map(item =>
                            <div
                                className="five-tribes__tile"
                                key={item[0]}
                            >
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
                        )}
                    </div>
                )}
            </div>
        );
    }
}

Board.propTypes = {
    gameState: PropTypes.array.isRequired,
};

export default connectWithRouter(
    state => ({
        gameState: state.gameStates.states[state.gameStates.states.length - 1],
    }),
    null,
    Board
);
