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

// reference for controlling react-player
let player;
const playerRef = (playerr) => {
    player = playerr;
};

export const Player = ({coord}) => {
    const [isPlaying, setPlaying] = React.useState(false);
    const [overallTime, setOverallTime] = React.useState(0);
    const [playerProgress, setPlayerProgress] = React.useState(INITIAL_PLAYER_PROGRESS);
    const [currentClip, setCurrentClip] = React.useState(coord.clips[0]);

    const updateProgress = (updatedProgress) => {
        const playerTimeChange = updatedProgress.playedSeconds - playerProgress.playedSeconds;

        setPlayerProgress(updatedProgress);

        // add the same time change in player's progress to overall progress
        setOverallTime(overallTime + playerTimeChange);
    };

    const onChangeClip = (clipId) => {
        if (clipId === currentClip.id) return;

        const changedClip = coord.clips.find((clip) => clip.id === clipId);
        setCurrentClip(changedClip);

        setOverallTime(changedClip.timePosition);

        // reset player progress
        setPlayerProgress(INITIAL_PLAYER_PROGRESS);
    };

    /**
     * @param {number} intent decimal of current progress bar's length
     */
    const onSeek = (intent) => {
        // get time position of intent
        const newTimePosition = intent * coord.length;

        const curClipRelTimePosition = (newTimePosition - currentClip.timePosition);

        if (curClipRelTimePosition > currentClip.duration) {
            // skip to next clip
            console.log('go to next');
        } else if (curClipRelTimePosition < 0) {
            // go to previous clip
            console.log('go to previous');
        } else {
            // seek current clip to new position
            player.seekTo(curClipRelTimePosition);
        }
    };

    return (
        <PlayerContainer>
            <ReactPlayer
                ref={playerRef}
                url={currentClip.url}
                onProgress={updateProgress}
                onPlay={() => (!isPlaying ? setPlaying(true) : null)}
                onPause={() => (isPlaying ? setPlaying(false) : null)}
                playing={isPlaying}
                controls
            />
            <ProgressBar
                length={coord.length}
                overallTime={overallTime}
                onSeek={onSeek}
            />
            <Timeline
                length={coord.length}
                clips={coord.clips}
                currentClipId={currentClip.id}
                currentClipProgress={playerProgress.played}
                onChangeClip={onChangeClip}
            />
        </PlayerContainer>
    );
};

Player.propTypes = {
    coord: PropTypes.shape({}).isRequired,
};
