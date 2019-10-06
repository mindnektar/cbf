import React from 'react';
import PropTypes from 'prop-types';
import { actions } from 'shared/games/azul';
import Action from '../../helpers/Action';
import Tile from '../Tile';

const PatternLines = (props) => {
    const isReversedPlayer = [1, 2].includes(props.playerIndex);

    return (
        <div className="azul__pattern-lines">
            {[...props.lines].reverse().map((line, index) => (
                <Action
                    action={actions.SELECT_PATTERN_LINE}
                    key={index}
                    payload={[4 - index]}
                    disabled={props.actionsDisabled}
                    offset={{ top: 14 }}
                >
                    <div
                        className="azul__pattern-line"
                        style={{ zIndex: isReversedPlayer ? index : 4 - index }}
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
