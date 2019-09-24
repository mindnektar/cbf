import React from 'react';
import PropTypes from 'prop-types';

class ScoreMarker extends React.Component {
    getPosition() {
        if (this.props.score === 0) {
            return [100, 0];
        }

        return [100 * (this.props.score % 20), 120 * Math.ceil(this.props.score / 20)];
    }

    render() {
        const [x, y] = this.getPosition();

        return (
            <div
                className="azul__score-marker"
                style={{ transform: `translate(${x}%, ${y}%)` }}
            />
        );
    }
}

ScoreMarker.propTypes = {
    score: PropTypes.number.isRequired,
};

export default ScoreMarker;
