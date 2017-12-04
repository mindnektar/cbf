import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import Tile from '../Tile';

class PatternLines extends React.Component {
    render() {
        return (
            <div className="azul__pattern-lines">
                {this.props.lines.map((line, index) =>
                    <div
                        className="azul__pattern-line"
                        key={index}
                    >
                        {line.map((lineItem, itemIndex) =>
                            <div
                                className="azul__pattern-line-item"
                                key={itemIndex}
                            >
                                {lineItem &&
                                    <Tile type={lineItem} />
                                }
                            </div>
                        )}
                    </div>
                )}
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
