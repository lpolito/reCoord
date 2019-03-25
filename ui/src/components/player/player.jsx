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
    // overallTime falls within the bounds of a clip
    clip.timePosition <= givenTime && (clip.timePosition + clip.duration) > givenTime
)).map((clip) => clip.id);

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

    const onChangeClip = (clipId) => {
        if (clipId === currentClip.id) return;

        const changedClip = coord.clips.find((clip) => clip.id === clipId);
        setCurrentClip(changedClip);

        // reset player progress
        setPlayerProgress(INITIAL_PLAYER_PROGRESS);

        // TODO figure out best way to start at middle of clip if overallTime falls in middle of clip
    };

    const updateProgress = (updatedProgress) => {
        const playerTimeChange = updatedProgress.playedSeconds - playerProgress.playedSeconds;

        setPlayerProgress(updatedProgress);

        // add the same time change in player's progress to overall progress
        const newOverallTime = overallTime + playerTimeChange;
        setOverallTime(newOverallTime);

        // calculate if the current clip can still play
        const curClipRelTimePosition = (newOverallTime - currentClip.timePosition);

        if (curClipRelTimePosition > currentClip.duration || curClipRelTimePosition < 0) {
            // newOverallTime is outside of bounds of current clip, change clips

            // just grab and use first playable clip for now
            const nextClipId = getPlayableClipIds(coord.clips, newOverallTime)[0];
            onChangeClip(nextClipId);
        }
    };

    /**
     * @param {number} intent decimal of current progress bar's length
     */
    const onSeek = (intent) => {
        // get time position of intent
        const newOverallTime = intent * coord.length;

        const curClipRelTimePosition = (newOverallTime - currentClip.timePosition);

        if (curClipRelTimePosition > currentClip.duration || curClipRelTimePosition < 0) {
            // newOverallTime is outside of bounds of current clip, change clips

            // just grab and use first playable clip for now
            const nextClipId = getPlayableClipIds(coord.clips, newOverallTime)[0];
            onChangeClip(nextClipId);

            setOverallTime(newOverallTime);
        } else {
            // seek current clip to new position
            // don't update overallTime here, the player will force an update itself once it seeks
            player.seekTo(curClipRelTimePosition);
        }
    };

    const playableClipIds = getPlayableClipIds(coord.clips, overallTime);

    return (
        <PlayerContainer>
            <ReactPlayer
                ref={playerRef}
                url={currentClip.url}
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
