import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import games from 'data/games';
import GameModel from 'models/play/game';
import Button from 'atoms/Button';
import Headline from 'atoms/Headline';
import Select from 'atoms/Select';
import Checkbox from 'atoms/Checkbox';
import Option from './Setup/Option';
import ImageValue from './Setup/ImageValue';

const Setup = (props) => {
    const { playerCount, options } = games[props.data.match.handle];
    const [invitedPlayers, setInvitedPlayers] = useState([]);
    const [numPlayers, setNumPlayers] = useState([...playerCount]);
    const [optionValues, setOptionValues] = useState((
        options.reduce((result, { key, values }) => ({
            ...result,
            [key]: values[0].value,
        }), {})
    ));
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
                ...Object.entries(optionValues).map(([type, value]) => ({
                    type, values: [value],
                })),
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

    const changeOptionHandler = (key, value) => () => {
        setOptionValues((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    return (
        <div className="cbf-setup">
            <Headline>Configure your match</Headline>

            <Option label="Number of players">
                {playerCount.map((value) => (
                    <Checkbox
                        checked={numPlayers.includes(value)}
                        onChange={() => toggleNumPlayers(value)}
                        key={value}
                    >
                        {value}
                    </Checkbox>
                ))}
            </Option>

            <Option label="Invite players">
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
            </Option>

            {options.map((option) => (
                <Option
                    label={option.label}
                    key={option.key}
                >
                    {option.values.map(({ label, image, value }) => (
                        <ImageValue
                            label={label}
                            image={image}
                            selected={optionValues[option.key] === value}
                            onChange={changeOptionHandler(option.key, value)}
                        />
                    ))}
                </Option>
            ))}

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
