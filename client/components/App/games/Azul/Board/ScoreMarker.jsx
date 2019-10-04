import React from 'react';
import PropTypes from 'prop-types';

const ScoreMarker = (props) => {
    const tops = [-4, 18, 42, 67, 93, 119];
    const style = { left: 25.5, top: tops[0] };

    if (props.score !== 0) {
        style.left = 5 + (20.5 * (props.score % 20));
        style.top = tops[Math.ceil(props.score / 20)];
    }

    return (
        <div
            className="azul__score-marker"
            style={style}
        />
    );
};

ScoreMarker.propTypes = {
    score: PropTypes.number.isRequired,
};

export default ScoreMarker;
