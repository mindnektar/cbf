import React from 'react';
import PropTypes from 'prop-types';
import ListModel from 'models/play/list';
import LoadingContainer from 'molecules/LoadingContainer';
import AllGames from './List/AllGames';
import MyGames from './List/MyGames';
import OpenGames from './List/OpenGames';
import FinishedGames from './List/FinishedGames';

const List = (props) => {
    const renderContent = () => (
        <>
            {props.data.me && (
                <>
                    <MyGames />
                    <OpenGames />
                </>
            )}

            <AllGames />
        </>
    );

    return (
        <LoadingContainer>
            {!props.data.loading && renderContent()}
        </LoadingContainer>
    );
};

List.propTypes = {
    data: PropTypes.object.isRequired,
};

export default ListModel.graphql(List);
