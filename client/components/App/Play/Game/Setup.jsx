import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import games from 'data/games';
import GameModel from 'models/play/game';
import Button from 'atoms/Button';
import Headline from 'atoms/Headline';
import Select from 'atoms/Select';
import Checkbox from 'atoms/Checkbox';

const Setup = (props) => {
    const possiblePlayers = [...games[props.data.match.handle].playerCount];
    const [invitedPlayers, setInvitedPlayers] = useState([]);
    const [numPlayers, setNumPlayers] = useState(possiblePlayers);
    const invitablePlayers = props.data.users.filter(({ id }) => (
        id !== props.data.me.id && !invitedPlayers.includes(id)
    ));
    const maxPlayers = numPlayers.reduce((result, current) => (
        current > result ? current : result
    ), 1);

    useEffect(() => {
        if (props.data.match.status === 'OPEN') {
            props.history.replace(`/play/${props.data.match.id}/lobby`);
        } else if (props.data.match.status === 'ACTIVE') {
            props.history.replace(`/play/${props.data.match.id}`);
        }
    }, []);

    const mayOpenMatch = () => (
        numPlayers.length > 0
    );

    const openMatch = async () => {
        await props.openMatch({
            id: props.data.match.id,
            players: invitedPlayers,
            options: [
                { type: 'num-players', values: numPlayers },
            ],
        });

        props.history.replace(`/play/${props.data.match.id}/lobby`);
    };

    const toggleInvitedPlayers = (id) => {
        const nextInvitedPlayers = [...invitedPlayers];
        const index = nextInvitedPlayers.indexOf(id);

        if (index >= 0) {
            nextInvitedPlayers.splice(index, 1);
        } else {
            nextInvitedPlayers.push(id);
        }

        setInvitedPlayers(nextInvitedPlayers);
    };

    const toggleNumPlayers = (id) => {
        const nextNumPlayers = [...numPlayers];
        const index = nextNumPlayers.indexOf(id);

        if (index >= 0) {
            nextNumPlayers.splice(index, 1);
        } else {
            nextNumPlayers.push(id);
        }

        setNumPlayers(nextNumPlayers);

        const nextMaxPlayers = nextNumPlayers.reduce((result, current) => (
            current > result ? current : result
        ), 1);

        if (invitedPlayers.length >= nextMaxPlayers) {
            setInvitedPlayers(invitedPlayers.slice(0, nextMaxPlayers - 1));
        }
    };

    return (
        <div className="cbf-setup">
            <Headline>Configure your match</Headline>

            <div className="cbf-setup__option">
                <div className="cbf-setup__option-label">
                    Number of players
                </div>

                <div className="cbf-setup__option-inputs">
                    {possiblePlayers.map((value) => (
                        <Checkbox
                            checked={numPlayers.includes(value)}
                            onChange={() => toggleNumPlayers(value)}
                            key={value}
                        >
                            {value}
                        </Checkbox>
                    ))}
                </div>
            </div>

            <div className="cbf-setup__option">
                <div className="cbf-setup__option-label">
                    Invite players
                </div>

                <div className="cbf-setup__option-inputs">
                    {invitedPlayers.map((id) => (
                        <div
                            className="cbf-setup__invited-player"
                            key={id}
                            onClick={() => toggleInvitedPlayers(id)}
                        >
                            {props.data.users.find((user) => user.id === id).name}

                            <span>&#x2718;</span>
                        </div>
                    ))}

                    {invitedPlayers.length < maxPlayers - 1 && (
                        <Select
                            onChange={toggleInvitedPlayers}
                            options={[
                                { value: '', label: 'Select a player' },
                                ...invitablePlayers.map((user) => ({
                                    value: user.id,
                                    label: user.name,
                                })),
                            ]}
                            value=""
                        />
                    )}
                </div>
            </div>

            <Button
                onClick={openMatch}
                disabled={!mayOpenMatch()}
            >
                Open match for joining
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
