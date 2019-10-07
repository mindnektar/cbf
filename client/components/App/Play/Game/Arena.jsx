import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import GameModel from 'models/play/game';
import Table from './Arena/Table';
import Sidebar from './Arena/Sidebar';
import Status from './Arena/Status';

let throttling = false;
let movement;

const Arena = (props) => {
    const [moving, setMoving] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [zoom, setZoom] = useState(1);
    const arenaRef = useRef();
    let minimumZoom = 1;

    useEffect(() => {
        if (props.data.match.status === 'SETTING_UP') {
            props.history.replace(`/play/${props.data.match.id}/setup`);
        } else if (props.data.match.status === 'OPEN') {
            props.history.replace(`/play/${props.data.match.id}/lobby`);
        }

        if (arenaRef.current) {
            arenaRef.current.addEventListener('mousewheel', changeZoom);
            arenaRef.current.addEventListener('DOMMouseScroll', changeZoom);

            initZoom();
        }

        return () => {
            if (arenaRef.current) {
                arenaRef.current.removeEventListener('mousewheel', changeZoom);
                arenaRef.current.removeEventListener('DOMMouseScroll', changeZoom);
            }
        };
    }, []);

    const onMouseDown = () => {
        movement = { x: 0, y: 0 };
        setMoving(true);
    };

    const onMouseLeave = () => {
        setMoving(false);
    };

    const onMouseMove = (event) => {
        if (moving) {
            movement.x += event.movementX / zoom;
            movement.y += event.movementY / zoom;

            if (!throttling) {
                setX(x - movement.x);
                setY(y - movement.y);

                movement = { x: 0, y: 0 };
                throttling = true;

                window.setTimeout(() => {
                    throttling = false;
                }, 20);
            }
        }
    };

    const onMouseUp = () => {
        setMoving(false);
    };

    const initZoom = () => {
        const { offsetHeight, offsetWidth } = document.querySelector('.cbf-table');
        const heightRatio = (window.innerHeight - 300) / offsetHeight;
        const widthRatio = (window.innerWidth - 400) / offsetWidth;
        const nextZoom = heightRatio < widthRatio ? heightRatio : widthRatio;

        setZoom(nextZoom);
        minimumZoom = nextZoom;
    };

    const changeZoom = (event) => {
        event.preventDefault();

        const delta = event.deltaY ? event.deltaY / 400 : event.detail / 100;

        setZoom((prevZoom) => (
            Math.max(
                minimumZoom,
                Math.min(
                    minimumZoom * 5,
                    prevZoom - delta
                )
            )
        ));
    };

    return ['ACTIVE', 'FINISHED'].includes(props.data.match.status) && (
        <>
            <Status />

            <Sidebar
                isGameFinished={props.data.match.status === 'FINISHED'}
                players={props.data.match.players}
            />

            <div
                className={classNames(
                    'cbf-arena',
                    { 'cbf-arena--moving': moving }
                )}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                ref={arenaRef}
            >
                <div
                    className="cbf-arena__canvas"
                    style={{ transform: `scale(${zoom}) translate(${-x}px, ${-y}px)` }}
                >
                    <Table />
                </div>
            </div>
        </>
    );
};

Arena.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default GameModel.graphql(withRouter(Arena));
