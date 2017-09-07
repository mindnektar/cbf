import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';

class Sidebar extends React.Component {
    render() {
        return (
            <div
                className="cbf-helper-sidebar"
                onMouseDown={event => event.stopPropagation()}
            >
                <div className="cbf-helper-sidebar__players">
                    {this.props.children}
                </div>

                <div className="cbf-helper-sidebar__history">
                    <div className="cbf-helper-sidebar__history-header">
                        Move history
                    </div>
                </div>
            </div>
        );
    }
}

Sidebar.propTypes = {
    children: PropTypes.node.isRequired,
    gameStates: PropTypes.array.isRequired,
};

export default connectWithRouter(
    state => ({
        gameStates: state.gameStates,
    }),
    null,
    Sidebar
);
