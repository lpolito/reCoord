import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ReactPlayer from 'react-player';


const PlayerContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;


export const Player = ({videoUrl, children}) => {
    const [progress, setProgress] = React.useState({});
    const [url, setUrl] = React.useState(videoUrl);

    return (
        <PlayerContainer>
            <ReactPlayer
                url={url}
                onProgress={setProgress}
                playing
            />
            {children({progress, onChange: setUrl})}
        </PlayerContainer>
    );
};

Player.propTypes = {
    videoUrl: PropTypes.string.isRequired,
    children: PropTypes.elementType.isRequired,
};
