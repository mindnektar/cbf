import React from 'react';
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
            <div className="five-tribes">
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
        );
    }
}

export default FiveTribes;
