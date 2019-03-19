import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ReactPlayer from 'react-player';


const PlayerContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;


export const Player = ({videoUrl, children}) => {
    const [playerProgress, setPlayerProgress] = React.useState({});
    const [url, setUrl] = React.useState(videoUrl);

    return (
        <PlayerContainer>
            <ReactPlayer
                url={url}
                onProgress={setPlayerProgress}
                controls
                // playing
            />
            {children({clipProgress: playerProgress.played, onChange: setUrl, url})}
        </PlayerContainer>
    );
};

Player.propTypes = {
    videoUrl: PropTypes.string.isRequired,
    children: PropTypes.elementType.isRequired,
};
