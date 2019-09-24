import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { assets } from 'shared/games/five-tribes';

class Djinn extends React.Component {
    render() {
        const { name, value } = assets.djinns[this.props.djinn];

        return (
            <div
                className={classNames(
                    'five-tribes__djinn',
                    {
                        'five-tribes__djinn--deck': this.props.djinn === null,
                    }
                )}
            >
                <div className="five-tribes__djinn-name">
                    {name}
                </div>

                <div className="five-tribes__djinn-value">
                    {value}
                </div>
            </div>
        );
    }
}

Djinn.defaultProps = {
    djinn: null,
};

Djinn.propTypes = {
    djinn: PropTypes.string,
};

export default Djinn;
