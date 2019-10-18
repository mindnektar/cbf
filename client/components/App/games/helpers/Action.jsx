import React, { useEffect, useState, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import MatchContext from 'contexts/MatchContext';
import handleAction from 'helpers/handleAction';

const Action = (props) => {
    if (props.disabled) {
        return props.children;
    }

    const { match, me, performAction, pushActions } = useContext(MatchContext);
    const [style, setStyle] = useState(null);
    const childRef = useRef();
    const state = match.states[match.stateIndex];
    const isActive = props.action.isValid({
        state,
        player: me,
        payload: props.payload,
    });

    useEffect(() => {
        const canvas = document.querySelector('.cbf-arena__canvas');
        const table = document.querySelector('.cbf-table');
        const tableRect = table.getBoundingClientRect();
        const scale = parseFloat(canvas.style.transform.match(/scale\(([.0-9]+)\)/)[1]);
        const childRect = childRef.current.getBoundingClientRect();
        const offsetLeft = props.offset.left || 0;
        const offsetTop = props.offset.top || 0;

        setStyle({
            left: ((childRect.left - tableRect.left) / scale) + offsetLeft,
            top: ((childRect.top - tableRect.top) / scale) + offsetTop,
            width: (childRect.width / scale),
            height: (childRect.height / scale),
        });
    }, [match.stateIndex]);

    const onClick = () => {
        if (isActive) {
            handleAction({
                match: match,
                action: props.action,
                payload: props.payload,
                player: me,
                pushActions,
                performAction,
            });
        }
    };

    return (
        <>
            {React.cloneElement(props.children, { ref: childRef })}

            {style && ReactDOM.createPortal((
                <div
                    className={classNames(
                        'cbf-helper-action',
                        { 'cbf-helper-action--active': isActive }
                    )}
                    onClick={onClick}
                    style={style}
                />
            ), document.querySelector('.cbf-table'))}
        </>
    );
};

Action.defaultProps = {
    payload: [],
    disabled: false,
    offset: {},
};

Action.propTypes = {
    action: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    match: PropTypes.object.isRequired,
    payload: PropTypes.array,
    disabled: PropTypes.bool,
    offset: PropTypes.shape({
        top: PropTypes.number,
        left: PropTypes.number,
    }),
};

export default withRouter(Action);
