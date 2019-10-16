import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import games from 'data/games';
import { Transition, TransitionGroup } from 'react-transition-group';
import Collapsible from 'molecules/Collapsible';
import Button from 'atoms/Button';

const GameList = (props) => {
    const actionHandler = (action, match) => () => (
        action.handler(match)
    );

    return (
        <div
            className={classNames(
                'cbf-game-list',
                { 'cbf-game-list--small': props.small }
            )}
        >
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
                                <div
                                    className={classNames(
                                        'cbf-game-list__item',
                                        { 'cbf-game-list__item--highlighted': props.highlightItem(match) }
                                    )}
                                >
                                    <div className="cbf-game-list__item-image">
                                        <img
                                            src={`/img/games/${match.handle}/box.jpg`}
                                            alt={games[match.handle].title}
                                        />
                                    </div>

                                    <div className="cbf-game-list__item-content">
                                        <div className="cbf-game-list__item-details">
                                            <div className="cbf-game-list__item-title">
                                                {games[match.handle].title}

                                                <div>{props.renderDate(match)}</div>
                                            </div>

                                            {props.children(match)}
                                        </div>

                                        <div className="cbf-game-list__item-options">
                                            {props.actions.map((action) => (
                                                <Button
                                                    onClick={actionHandler(action, match)}
                                                    secondary={props.small}
                                                    key={action.label}
                                                >
                                                    {action.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Collapsible>
                        )}
                    </Transition>
                ))}
            </TransitionGroup>
        </div>
    );
};

GameList.defaultProps = {
    small: false,
    highlightItem: () => false,
    renderDate: () => null,
};

GameList.propTypes = {
    children: PropTypes.func.isRequired,
    matches: PropTypes.array.isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
        handler: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
    })).isRequired,
    small: PropTypes.bool,
    highlightItem: PropTypes.func,
    renderDate: PropTypes.func,
};

export default GameList;
