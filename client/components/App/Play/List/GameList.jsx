import React from 'react';
import PropTypes from 'prop-types';
import games from 'data/games';
import { Transition, TransitionGroup } from 'react-transition-group';
import Collapsible from 'molecules/Collapsible';
import Button from 'atoms/Button';

const GameList = (props) => {
    const actionHandler = (match) => () => (
        props.action.handler(match)
    );

    return (
        <TransitionGroup component={React.Fragment}>
            {props.matches.map((match) => (
                <Transition
                    mountOnEnter
                    timeout={300}
                    unmountOnExit
                    key={match.id}
                >
                    {(transitionState) => (
                        <Collapsible collapsed={transitionState !== 'entered'}>
                            <div className="cbf-all-games__item">
                                <div className="cbf-all-games__item-image">
                                    <img
                                        src={`/img/games/${match.handle}/box.jpg`}
                                        alt={games[match.handle].title}
                                    />
                                </div>

                                <div className="cbf-all-games__item-content">
                                    <div className="cbf-all-games__item-details">
                                        <div className="cbf-all-games__item-title">
                                            {games[match.handle].title}
                                        </div>

                                        {props.children(match)}
                                    </div>

                                    <div className="cbf-all-games__item-options">
                                        <Button onClick={actionHandler(match)}>
                                            {props.action.label}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Collapsible>
                    )}
                </Transition>
            ))}
        </TransitionGroup>
    );
};

GameList.propTypes = {
    children: PropTypes.func.isRequired,
    matches: PropTypes.array.isRequired,
    action: PropTypes.shape({
        handler: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
    }).isRequired,
};

export default GameList;
