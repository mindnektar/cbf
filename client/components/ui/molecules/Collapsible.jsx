import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const Collapsible = (props) => {
    let timeout;
    const contentRef = useRef();
    const [height, setHeight] = useState(props.collapsed ? 0 : null);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.offsetHeight);

            if (props.collapsed) {
                timeout = window.setTimeout(() => setHeight(0), 0);
            } else {
                timeout = window.setTimeout(() => setHeight(null), 300);
            }
        }

        return () => window.clearTimeout(timeout);
    }, [props.collapsed]);

    return (
        <div
            className="cbf-ui-collapsible"
            style={{ height }}
        >
            <TransitionGroup component={React.Fragment}>
                {!props.collapsed && (
                    <CSSTransition
                        classNames="cbf-ui-collapsible-"
                        mountOnEnter
                        timeout={300}
                        unmountOnExit
                    >
                        <div
                            className="cbf-ui-collapsible__content"
                            ref={contentRef}
                        >
                            {props.children}
                        </div>
                    </CSSTransition>
                )}
            </TransitionGroup>
        </div>
    );
};

Collapsible.defaultProps = {
    children: null,
};

Collapsible.propTypes = {
    children: PropTypes.node,
    collapsed: PropTypes.bool.isRequired,
};

export default Collapsible;
