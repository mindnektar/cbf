import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { assets } from 'shared/games/five-tribes';

class FiveTribes extends React.Component {
    render() {
        const gameState = this.props.gameStates[this.props.gameStates.length - 1];

        return (
            <div className="five-tribes">
                <div className="five-tribes__board">
                    {gameState[0][0][0].map((row, rowIndex) =>
                        <div
                            className="five-tribes__board-row"
                            key={`row${row[0]}`}
                        >
                            {row.map((tile, tileIndex) =>
                                <div
                                    className="five-tribes__tile"
                                    key={tile}
                                >
                                    <div
                                        className={classNames(
                                            'five-tribes__tile-value',
                                            `five-tribes__tile-value--${assets.tiles[tile].color}`
                                        )}
                                    >
                                        {assets.tiles[tile].value}
                                    </div>

                                    <div className="five-tribes__tile-action">
                                        {assets.tiles[tile].action}
                                    </div>

                                    <div className="five-tribes__tile-meeples">
                                        {gameState[0][0][1][rowIndex][tileIndex].map(meeple =>
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

                <div className="five-tribes__market">
                    <div className="five-tribes__market-item five-tribes__market-item--deck">
                        <div className="five-tribes__market-item-name">
                            {gameState[0][0][3]} resources remaining
                        </div>
                    </div>

                    {gameState[0][0][2].map(resource =>
                        <div
                            className={classNames(
                                'five-tribes__market-item',
                                { 'five-tribes__market-item--fakir': assets.resources[resource] === 'Fakir' }
                            )}
                            key={resource}
                        >
                            <div className="five-tribes__market-item-name">
                                {assets.resources[resource]}
                            </div>

                            <div className="five-tribes__market-item-frequency">
                                {assets.resources.filter(
                                    name => name === assets.resources[resource]
                                ).length}x
                            </div>
                        </div>
                    )}
                </div>

                <div className="five-tribes__djinns">

                </div>
            </div>
        );
    }
}

FiveTribes.propTypes = {
    gameStates: PropTypes.array.isRequired,
};

export default connectWithRouter(
    state => ({
        gameStates: state.gameStates,
    }),
    null,
    FiveTribes
);
