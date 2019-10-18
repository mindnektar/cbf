import React from 'react';
import PropTypes from 'prop-types';
import azul from 'shared/games/azul';
import Action from '../../helpers/Action';
import Tile from '../Tile';

const FloorLine = (props) => (
    <Action
        action={azul.actions.SELECT_PATTERN_LINE}
        payload={[null]}
        disabled={props.actionsDisabled}
        offset={{ top: 14 }}
    >
        <div className="azul__floor-line">
            {props.floorLine.map((tile, tileIndex) => (
                <Tile
                    key={tileIndex}
                    type={tile}
                />
            ))}
        </div>
    </Action>
);

FloorLine.propTypes = {
    floorLine: PropTypes.array.isRequired,
    actionsDisabled: PropTypes.bool.isRequired,
};

export default FloorLine;
