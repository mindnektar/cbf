import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { assets } from 'shared/games/five-tribes';

class Resource extends React.Component {
    render() {
        const type = assets.resources[this.props.resource];

        return (
            <div
                className={classNames(
                    'five-tribes__resource',
                    {
                        'five-tribes__resource--fakir': type === 'Fakir',
                        'five-tribes__resource--deck': this.props.resource === null,
                    }
                )}
            >
                <div className="five-tribes__resource-name">
                    {type}
                </div>

                <div className="five-tribes__resource-frequency">
                    {assets.resources.filter(
                        name => name === type
                    ).length}x
                </div>
            </div>
        );
    }
}

Resource.defaultProps = {
    resource: null,
};

Resource.propTypes = {
    resource: PropTypes.string,
};

export default connectWithRouter(
    null,
    null,
    Resource
);
