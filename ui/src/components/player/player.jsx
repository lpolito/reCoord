import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ReactPlayer from 'react-player';

import {ProgressBar} from './progressbar';
import {Timeline} from './timeline';


const PlayerContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const INITIAL_PLAYER_PROGRESS = {
    played: 0,
    playedSeconds: 0,
};


export const Player = ({coord}) => {
    const [overallProgress, setOverallProgress] = React.useState(0);
    const [playerProgress, setPlayerProgress] = React.useState(INITIAL_PLAYER_PROGRESS);
    const [playingClip, setPlayingClip] = React.useState(coord.clips[0]);

    const {length, clips} = coord;
    const {id, url} = playingClip;

    const updateProgress = (updatedProgress) => {
        const playerProgressChange = updatedProgress.playedSeconds - playerProgress.playedSeconds;

        setPlayerProgress(updatedProgress);

        // add the same time change in player's progress to overall progress
        setOverallProgress(overallProgress + playerProgressChange);
    };

    const changeClip = (clipId) => {
        if (clipId === playingClip.id) return;

        const changedClip = coord.clips.find((clip) => clip.id === clipId);
        setPlayingClip(changedClip);

        setOverallProgress(changedClip.xPosition);

        // reset player progress
        setPlayerProgress(INITIAL_PLAYER_PROGRESS);
    };

    return (
        <PlayerContainer>
            <ReactPlayer
                url={url}
                onProgress={updateProgress}
                controls
                // playing
            />
            <ProgressBar length={length} overallProgress={overallProgress} />
            <Timeline
                length={length}
                clips={clips}
                overallProgress={overallProgress}
                clipProgress={playerProgress.played}
                onChange={changeClip}
                currentClipId={id}
            />
        </PlayerContainer>
    );
};

Player.propTypes = {
    coord: PropTypes.shape({}).isRequired,
};
