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

const getPlayableClipIds = (clips, givenTime) => clips.filter((clip) => (
    // overallTime falls within the bounds of a clip.
    clip.timePosition <= givenTime && (clip.timePosition + clip.duration) > givenTime
)).map((clip) => clip.id);

// Reference for controlling react-player.
let player;
const playerRef = (playerr) => {
    player = playerr;
};

export const Player = ({coord}) => {
    const [isPlaying, setPlaying] = React.useState(false);
    const [overallTime, setOverallTime] = React.useState(0);
    const [playerProgress, setPlayerProgress] = React.useState(INITIAL_PLAYER_PROGRESS);
    const [currentClip, setCurrentClip] = React.useState(coord.clips[0]);

    const [startTime, setStartTime] = React.useState(0);

    const onChangeClip = (clipId) => {
        if (clipId === currentClip.id) return;

        const changedClip = coord.clips.find((clip) => clip.id === clipId);
        setCurrentClip(changedClip);

        // Reset player progress.
        setPlayerProgress(INITIAL_PLAYER_PROGRESS);

        const nextStartTime = overallTime - changedClip.timePosition;
        setStartTime(nextStartTime);
    };

    const updateProgress = (newPlayerProgress) => {
        const playerTimeChange = newPlayerProgress.playedSeconds - playerProgress.playedSeconds;
        console.log({playerTimeChange})

        setPlayerProgress(newPlayerProgress);

        // Add the same time change in player's progress to overall progress.
        const newOverallTime = overallTime + playerTimeChange;
        setOverallTime(newOverallTime);
    };

    /**
     * @param {number} intent Decimal of current progress bar's length.
     */
    const onSeek = (intent) => {
        // Convert intent to overallTime.
        const newOverallTime = intent * coord.length;
        setOverallTime(newOverallTime);

        const curClipRelTimePosition = (newOverallTime - currentClip.timePosition);
        // Only seek if newOverallTime falls within the current clip.
        // Otherwise useEffect will autiomatically change the clip to the correct startTime.
        if (curClipRelTimePosition < currentClip.duration && curClipRelTimePosition > 0) {
            // Seek current clip to new position.
            player.seekTo(curClipRelTimePosition);
        }
    };

    // Track overallTime and update if clips need to be changed or the player needs to seek.
    React.useEffect(() => {
        const curClipRelTimePosition = (overallTime - currentClip.timePosition);

        if (curClipRelTimePosition > currentClip.duration || curClipRelTimePosition < 0) {
            // overallTime is outside of bounds of current clip, change clips.
            // Just grab and use first playable clip for now.
            const nextClipId = getPlayableClipIds(coord.clips, overallTime)[0];
            onChangeClip(nextClipId);
        }
    }, [overallTime, currentClip]);

    const playableClipIds = getPlayableClipIds(coord.clips, overallTime);

    const url = `${currentClip.url}&t=${Math.floor(startTime)}`;

    return (
        <PlayerContainer>
            <ReactPlayer
                ref={playerRef}
                url={url}
                onProgress={updateProgress}
                onPlay={() => (!isPlaying ? setPlaying(true) : null)}
                onPause={() => (isPlaying ? setPlaying(false) : null)}
                playing={isPlaying}
            />
            <ProgressBar
                length={coord.length}
                overallTime={overallTime}
                onSeek={onSeek}
            />
            <Timeline
                length={coord.length}
                clips={coord.clips}
                playableClipIds={playableClipIds}
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
