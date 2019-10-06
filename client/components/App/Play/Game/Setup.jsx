import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import games from 'data/games';
import GameModel from 'models/play/game';
import Button from 'atoms/Button';
import Headline from 'atoms/Headline';
import Option from './Setup/Option';

const Setup = (props) => {
    const possiblePlayers = [...games[props.data.match.handle].playerCount];
    const [numPlayers, setNumPlayers] = useReducer((prevNumPlayers, value) => {
        const nextNumPlayers = [...prevNumPlayers];
        const index = prevNumPlayers.indexOf(value);

        if (index >= 0) {
            nextNumPlayers.splice(index, 1);
        } else {
            nextNumPlayers.push(value);
        }

        return nextNumPlayers;
    }, possiblePlayers);

    useEffect(() => {
        if (props.data.match.status === 'OPEN') {
            props.history.replace(`/play/${props.data.match.id}/lobby`);
        } else if (props.data.match.status === 'ACTIVE') {
            props.history.replace(`/play/${props.data.match.id}`);
        }
    }, []);

    const openMatch = async () => {
        await props.openMatch({
            id: props.data.match.id,
            options: [
                { type: 'num-players', values: numPlayers },
            ],
        });

        props.history.replace(`/play/${props.data.match.id}/lobby`);
    };

    return (
        <div className="cbf-setup">
            <Headline>Configure your game</Headline>

            <Option
                label="Number of players"
                possibleValues={possiblePlayers}
                values={numPlayers}
                onChangeHandler={(value) => () => setNumPlayers(value)}
            />

            <Button onClick={openMatch}>
                Open game for joining
            </Button>
        </div>
    );
};

Setup.propTypes = {
    data: PropTypes.object.isRequired,
    openMatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(GameModel.graphql(Setup));
