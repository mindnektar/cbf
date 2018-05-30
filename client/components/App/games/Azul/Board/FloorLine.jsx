import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { actions } from 'shared/games/azul';
import Action from '../../helpers/Action';
import Tile from '../Tile';

class FloorLine extends React.Component {
    render() {
        return (
            <Action
                action={actions.SELECT_PATTERN_LINE}
                params={[null]}
            >
                <div className="azul__floor-line">
                    {Array(7).fill(null).map((_, itemIndex) => (
                        <div
                            className="azul__pattern-line-item"
                            key={itemIndex}
                        >
                            {this.props.floorLine[itemIndex] !== undefined &&
                                <Tile type={this.props.floorLine[itemIndex]} />
                            }
                        </div>
                    ))}
                </div>
            </Action>
        );
    }
}

FloorLine.propTypes = {
    floorLine: PropTypes.array.isRequired,
};

export default connectWithRouter(
    null,
    null,
    FloorLine
);
