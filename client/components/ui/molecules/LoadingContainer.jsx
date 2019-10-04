import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const LoadingContainer = (props) => (
    <div className="cbf-ui-loading-container">
        <TransitionGroup component={React.Fragment}>
            {!props.children && (
                <CSSTransition
                    classNames="cbf-ui-loading-container__content-"
                    mountOnEnter
                    timeout={300}
                    unmountOnExit
                >
                    <div className="cbf-ui-loading-container__content cbf-ui-loading-container__wrapper">
                        <img
                            alt="loading"
                            className="cbf-ui-loading-container__animation"
                            src="/img/loading.gif"
                        />
                    </div>
                </CSSTransition>
            )}

            {props.children && (
                <CSSTransition
                    classNames="cbf-ui-loading-container__content-"
                    mountOnEnter
                    timeout={300}
                    unmountOnExit
                >
                    <div className="cbf-ui-loading-container__content">
                        {props.children}
                    </div>
                </CSSTransition>
            )}
        </TransitionGroup>
    </div>
);

LoadingContainer.defaultProps = {
    children: null,
};

LoadingContainer.propTypes = {
    children: PropTypes.node,
};

export default LoadingContainer;
