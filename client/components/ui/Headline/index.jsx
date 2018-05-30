import React from 'react';
import PropTypes from 'prop-types';

class Headline extends React.Component {
    render() {
        return (
            <div className="cbf-ui-headline">
                {this.props.children}
            </div>
        );
    }
}

Headline.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Headline;
