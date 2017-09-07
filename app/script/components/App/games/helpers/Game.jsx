import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Game extends React.Component {
    render() {
        return (
            <div
                className={classNames(
                    'cbf-helper-game',
                    { 'cbf-helper-game--awaits-action': this.props.awaitsAction }
                )}
            >
                {this.props.children}
            </div>
        );
    }
}

Game.propTypes = {
    awaitsAction: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};

export default Game;
