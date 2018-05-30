import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
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
                        params={[index]}
                    >
                        <div
                            className="azul__pattern-line"
                            key={index}
                        >
                            {Array(index + 1).fill(null).map((_, itemIndex) => (
                                <div
                                    className="azul__pattern-line-item"
                                    key={itemIndex}
                                >
                                    {line[itemIndex] !== undefined &&
                                        <Tile type={line[itemIndex]} />
                                    }
                                </div>
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

export default connectWithRouter(
    null,
    null,
    PatternLines
);
