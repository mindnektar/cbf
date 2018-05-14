import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';

class ScoreTrack extends React.Component {
    render() {
        return (
            <div className="azul__score-track">
                {Array(101).fill(null).map((_, index) =>
                    <div
                        className={classNames(
                            'azul__score-field',
                            { 'azul__score-field--active': this.props.score === index }
                        )}
                        key={index}
                    >
                        <div className="azul__score-marker">
                            <div className="azul__score-number">
                                {index % 5 === 0 && index}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

ScoreTrack.propTypes = {
    score: PropTypes.number.isRequired,
};

export default connectWithRouter(
    null,
    null,
    ScoreTrack
);
