import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { actions } from 'shared/games/azul';
import Action from '../helpers/Action';
import Tile from './Tile';

class Factory extends React.Component {
    render() {
        return (
            <div
                className={classNames(
                    'azul__factory',
                    `azul__factory--display-count-${this.props.factoryTiles.length}`
                )}
            >
                <div className="azul__factory-circle">
                    {this.props.factoryTiles.map((display, index) => (
                        <div
                            className="azul__factory-display"
                            key={index}
                        >
                            {display.map((tile, tileIndex) => (
                                <Action
                                    action={actions.PICK_UP_TILES}
                                    key={tileIndex}
                                    payload={[index, tile]}
                                >
                                    <Tile type={tile} />
                                </Action>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="azul__factory-center">
                    {this.props.centerTiles.map((tile, index) => (
                        <Action
                            action={actions.PICK_UP_TILES}
                            key={index}
                            payload={[null, tile]}
                        >
                            <Tile type={tile} />
                        </Action>
                    ))}
                </div>
            </div>
        );
    }
}

Factory.propTypes = {
    centerTiles: PropTypes.array.isRequired,
    factoryTiles: PropTypes.array.isRequired,
};

export default Factory;
