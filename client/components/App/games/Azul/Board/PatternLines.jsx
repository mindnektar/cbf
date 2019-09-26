import React from 'react';
import PropTypes from 'prop-types';
import { actions } from 'shared/games/azul';
import Action from '../../helpers/Action';
import Tile from '../Tile';

class PatternLines extends React.Component {
    render() {
        return (
            <div className="azul__pattern-lines">
                {this.props.lines.map((line, index) => (
                    <Action
                        action={actions.SELECT_PATTERN_LINE}
                        key={index}
                        payload={[index]}
                    >
                        <div
                            className="azul__pattern-line"
                            key={index}
                        >
                            {line.map((tile, tileIndex) => (
                                <Tile
                                    key={tileIndex}
                                    type={tile}
                                />
                            ))}
                        </div>
                    </Action>
                ))}
            </div>
        );
    }
}

PatternLines.propTypes = {
    lines: PropTypes.array.isRequired,
};

export default PatternLines;
