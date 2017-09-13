import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import classNames from 'classnames';
import { actions, assets, transformers, validators } from 'shared/games/five-tribes';
import Action from '../helpers/Action';
import Player, { PlayerDetail, PlayerRow } from '../helpers/Player';
import Resource from './Resource';

const playerColors = [
    '#7dcee2',
    '#f1bed7',
];

const sortResources = resources => (
    resources
        .sort((a, b) => {
            if (assets.resources[a] === 'Fakir') {
                return -1;
            }

            if (assets.resources[b] === 'Fakir') {
                return 1;
            }

            return assets.resources[a].localeCompare(assets.resources[b]);
        })
);

class Players extends React.Component {
    render() {
        const playerData = this.props.gameState.public.players;
        const privatePlayerData = this.props.gameState.private.players;

        return (
            <div className="five-tribes__players">
                {this.props.playerOrder.map((userId, playerIndex) =>
                    <Player
                        color={playerColors[playerIndex]}
                        key={userId}
                        username={this.props.users[userId].username}
                    >
                        <PlayerRow>
                            <PlayerDetail header="Camels">
                                {playerData[playerIndex].camelCount}
                            </PlayerDetail>

                            {userId === this.props.me.id &&
                                <PlayerDetail header="Gold coins">
                                    {privatePlayerData[playerIndex].goldCoinCount}
                                </PlayerDetail>
                            }
                        </PlayerRow>

                        <PlayerRow>
                            <PlayerDetail header="Viziers">
                                {playerData[playerIndex].viziers.map((meeple, meepleIndex) =>
                                    <Action
                                        action={actions.KILL_VIZIER_FROM_PLAYER}
                                        key={meeple}
                                        params={[playerIndex, meepleIndex]}
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
                            </PlayerDetail>

                            <PlayerDetail header="Elders">
                                {playerData[playerIndex].elders.map((meeple, meepleIndex) =>
                                    <Action
                                        action={actions.KILL_ELDER_FROM_PLAYER}
                                        key={meeple}
                                        params={[playerIndex, meepleIndex]}
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
                            </PlayerDetail>
                        </PlayerRow>

                        <PlayerDetail header="Resources">
                            {userId === this.props.me.id ? (
                                sortResources(privatePlayerData[playerIndex].resources).map(resource =>
                                    <Resource
                                        key={resource}
                                        resource={resource}
                                    />
                                )
                            ) : (
                                Array(playerData[playerIndex].resourceCount).fill(null).map((resource, index) =>
                                    <Resource
                                        key={index}
                                        resource={null}
                                    />
                                )
                            )}
                        </PlayerDetail>

                        <PlayerDetail header="Djinns">
                            {playerData[playerIndex].djinns.map(
                                djinnIndex => assets.djinns[djinnIndex].name
                            ).join(', ')}
                        </PlayerDetail>
                    </Player>
                )}
            </div>
        );
    }
}

Players.propTypes = {
    gameState: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    playerOrder: PropTypes.array.isRequired,
    users: PropTypes.object.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        gameState: state.gameStates.states[state.gameStates.states.length - 1],
        me: state.me,
        playerOrder: state.games[ownProps.match.params.gameId].playerOrder,
        users: state.users,
    }),
    null,
    Players
);
