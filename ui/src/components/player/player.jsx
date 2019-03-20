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
    const [overallProgress, setOverallProgress] = React.useState(0);
    const [playerProgress, setPlayerProgress] = React.useState({
        played: 0,
        playedSeconds: 0,
    });
    const [url, setUrl] = React.useState(videoUrl);

    const updateProgress = (updatedProgress) => {
        const playerProgressChange = updatedProgress.playedSeconds - playerProgress.playedSeconds;

        setPlayerProgress(updatedProgress);

        // add the same time change in player's progress to overall progress
        setOverallProgress(overallProgress + playerProgressChange);
    };

    return (
        <PlayerContainer>
            <ReactPlayer
                url={url}
                onProgress={updateProgress}
                controls
                // playing
            />
            {children({
                overallProgress, clipProgress: playerProgress.played || 0, onChange: setUrl, url,
            })}
        </PlayerContainer>
    );
};

Player.propTypes = {
    videoUrl: PropTypes.string.isRequired,
    children: PropTypes.elementType.isRequired,
};
