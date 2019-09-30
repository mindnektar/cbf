import React from 'react';
import PropTypes from 'prop-types';

const Headline = (props) => (
    <div className="cbf-ui-headline">
        {props.children}
    </div>
);

Headline.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Headline;
