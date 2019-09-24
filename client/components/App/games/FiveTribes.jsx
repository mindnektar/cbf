import React from 'react';
import { actions, states } from 'shared/games/five-tribes';
import Game from './helpers/Game';
import Sidebar from './helpers/Sidebar';
import Status from './helpers/Status';
import BidOrder from './FiveTribes/BidOrder';
import TurnOrder from './FiveTribes/TurnOrder';
import Board from './FiveTribes/Board';
import Djinns from './FiveTribes/Djinns';
import Market from './FiveTribes/Market';
import Hand from './FiveTribes/Hand';
import Players from './FiveTribes/Players';

class FiveTribes extends React.Component {
    render() {
        return (
            <Game states={states}>
                <div className="five-tribes">
                    <Status
                        endTurnAction={actions.END_TURN}
                        states={states}
                    />

                    <Sidebar actions={actions} />

                    <div className="five-tribes__game">
                        <div className="five-tribes__top">
                            <div className="five-tribes__left">
                                <div className="five-tribes__tracks">
                                    <BidOrder />

                                    <TurnOrder />
                                </div>

                                <Board />
                            </div>

                            <Hand />

                            <Djinns />
                        </div>

                        <Market />
                    </div>

                    <Players />
                </div>
            </Game>
        );
    }
}

export default FiveTribes;
