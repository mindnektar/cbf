import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';

class Player extends React.Component {
    render() {
        return (
            <div className="cbf-helper-player">
                <div className="cbf-helper-player__header">
                    {this.props.color &&
                        <div
                            className="cbf-helper-player__color"
                            style={{ backgroundColor: this.props.color }}
                        />
                    }

                    <div className="cbf-helper-player__name">
                        {this.props.username}
                    </div>
                </div>

                {this.props.children}
            </div>
        );
    }
}

Player.defaultProps = {
    color: null,
};

Player.propTypes = {
    children: PropTypes.node.isRequired,
    color: PropTypes.string,
    username: PropTypes.string.isRequired,
};

export default connectWithRouter(
    null,
    null,
    Player
);
