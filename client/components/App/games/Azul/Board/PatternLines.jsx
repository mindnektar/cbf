import React from 'react';
import PropTypes from 'prop-types';
import { actions } from 'shared/games/azul';
import Action from '../../helpers/Action';
import Tile from '../Tile';

const PatternLines = (props) => {
    const isReversedPlayer = props.playerIndex % 2 === 1;
    const alteredLines = isReversedPlayer ? [...props.lines].reverse() : props.lines;

    return (
        <div
            className="azul__pattern-lines"
            style={isReversedPlayer ? { flexDirection: 'column-reverse' } : null}
        >
            {alteredLines.map((line, index) => (
                <Action
                    action={actions.SELECT_PATTERN_LINE}
                    key={index}
                    payload={[index]}
                    disabled={props.actionsDisabled}
                    offset={{ top: 14 }}
                >
                    <div
                        className="azul__pattern-line"
                        key={index}
                    >
                        {line.map((tile, tileIndex) => (
                            <Tile
                                key={tileIndex}
                                type={tile}
                                style={{
                                    zIndex: isReversedPlayer ? tileIndex : line.length - tileIndex,
                                }}
                            />
                        ))}
                    </div>
                </Action>
            ))}
        </div>
    );
};

PatternLines.propTypes = {
    lines: PropTypes.array.isRequired,
    actionsDisabled: PropTypes.bool.isRequired,
    playerIndex: PropTypes.number.isRequired,
};

export default PatternLines;
