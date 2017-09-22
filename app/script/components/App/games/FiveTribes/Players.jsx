import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { updateGlobalGameParams } from 'actions/games';
import { actions, assets, states } from 'shared/games/five-tribes';
import Action from '../helpers/Action';
import LocalAction from '../helpers/LocalAction';
import Player, { PlayerDetail, PlayerRow } from '../helpers/Player';
import Djinn from './Djinn';
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
    selectElderHandler = resource => () => {
        const selectedElders = [...this.props.globalGameParams.selectedElders];
        const elderIndex = selectedElders.indexOf(resource);

        if (elderIndex >= 0) {
            selectedElders.splice(elderIndex, 1);
        } else {
            selectedElders.push(resource);
        }

        this.props.updateGlobalGameParams({ selectedElders });
    }

    selectFakirHandler = resource => () => {
        const selectedFakirs = [...this.props.globalGameParams.selectedFakirs];
        const fakirIndex = selectedFakirs.indexOf(resource);

        if (fakirIndex >= 0) {
            selectedFakirs.splice(fakirIndex, 1);
        } else {
            selectedFakirs.push(resource);
        }

        this.props.updateGlobalGameParams({ selectedFakirs });
    }

    renderElder(meeple, meepleIndex, playerIndex) {
        const elderJsx = (
            <div
                className={classNames(
                    'five-tribes__meeple',
                    `five-tribes__meeple--${assets.meeples[meeple]}`
                )}
            />
        );

        if (this.props.gameState.state === states.COLLECT_DJINN.id) {
            return (
                <LocalAction
                    active={actions.COLLECT_DJINN.isElderSelectable(this.props.gameState, meeple)}
                    key={meeple}
                    onTouchTap={this.selectElderHandler(meeple)}
                    selected={(this.props.globalGameParams.selectedElders || []).includes(meeple)}
                >
                    {elderJsx}
                </LocalAction>
            );
        }

        return (
            <Action
                action={actions.KILL_ELDER_FROM_PLAYER}
                key={meeple}
                params={[playerIndex, meepleIndex]}
            >
                {elderJsx}
            </Action>
        );
    }

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
                                    >
                                        <div
                                            className={classNames(
                                                'five-tribes__meeple',
                                                `five-tribes__meeple--${assets.meeples[meeple]}`
                                            )}
                                        />
                                    </Action>
                                )}
                            </PlayerDetail>

                            <PlayerDetail header="Elders">
                                {playerData[playerIndex].elders.map((meeple, meepleIndex) =>
                                    this.renderElder(meeple, meepleIndex, playerIndex)
                                )}
                            </PlayerDetail>
                        </PlayerRow>

                        <PlayerDetail header="Resources">
                            {userId === this.props.me.id ? (
                                sortResources(privatePlayerData[playerIndex].resources).map(resource =>
                                    <LocalAction
                                        active={
                                            actions.SELECT_FAKIRS_FOR_MEEPLE_ACTION.isSelectable(
                                                this.props.gameState, resource
                                            ) ||
                                            actions.COLLECT_DJINN.isFakirSelectable(
                                                this.props.gameState, resource
                                            )
                                        }
                                        key={resource}
                                        onTouchTap={this.selectFakirHandler(resource)}
                                        selected={(this.props.globalGameParams.selectedFakirs || []).includes(resource)}
                                    >
                                        <Resource resource={resource} />
                                    </LocalAction>
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
                            {playerData[playerIndex].djinns.map(djinn =>
                                <Djinn djinn={djinn} />
                            )}
                        </PlayerDetail>
                    </Player>
                )}
            </div>
        );
    }
}

Players.propTypes = {
    gameState: PropTypes.object.isRequired,
    globalGameParams: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    playerOrder: PropTypes.array.isRequired,
    updateGlobalGameParams: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        gameState: state.gameStates.states[state.gameStates.currentState],
        globalGameParams: state.gameStates.globalGameParams,
        me: state.me,
        playerOrder: state.games[ownProps.match.params.gameId].playerOrder,
        users: state.users,
    }),
    {
        updateGlobalGameParams,
    },
    Players
);
