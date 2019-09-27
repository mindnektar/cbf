import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import GameModel from 'models/play/game';
import Button from 'Button';
import Headline from 'Headline';

class Setup extends React.Component {
    componentWillMount() {
        if (this.props.data.match.status === 'OPEN') {
            this.props.history.replace(`/play/${this.props.data.match.id}/lobby`);
        } else if (this.props.data.match.status === 'ACTIVE') {
            this.props.history.replace(`/play/${this.props.data.match.id}`);
        }
    }

    openMatch = async () => {
        await this.props.openMatch(this.props.data.match.id);

        this.props.history.replace(`/play/${this.props.data.match.id}/lobby`);
    }

    render() {
        return (
            <div>
                <Headline>Configure your game</Headline>

                <Button onClick={this.openMatch}>
                    Open game for joining
                </Button>
            </div>
        );
    }
}

Setup.propTypes = {
    data: PropTypes.object.isRequired,
    openMatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(GameModel.graphql(Setup));
