import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ReactPlayer from 'react-player';

import {ProgressBar} from './progressbar';
import {Timeline} from './timeline';
import {useInterval} from '../../hooks/use-interval';

const TIME_REFRESH_SECONDS = 1;

const PlayerContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

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
    const [currentClip, setCurrentClip] = React.useState(coord.clips[0]);
    const [startTime, setStartTime] = React.useState(null);

    useInterval(() => {
        setOverallTime(overallTime + TIME_REFRESH_SECONDS);
    }, isPlaying ? TIME_REFRESH_SECONDS * 1000 : null);

    const onChangeClip = (clipId) => {
        if (clipId === currentClip.id) return;

        const newCurrentClip = coord.clips.find((clip) => clip.id === clipId);
        setCurrentClip(newCurrentClip);

        const nextStartTime = overallTime - newCurrentClip.timePosition;
        if (nextStartTime > 1) {
            setStartTime(nextStartTime);
        } else {
            setStartTime(null);
        }
    };

    /**
     * @param {number} intent Decimal of current progress bar's length.
     */
    const onSeek = (intent) => {
        // Convert intent to overallTime.
        const newOverallTime = intent * coord.length;
        setOverallTime(newOverallTime);

        const curClipRelTimePosition = (newOverallTime - currentClip.timePosition);
        // Only seek player if curClipRelTimePosition falls within the current clip.
        // Otherwise useEffect will automatically change the clip to the correct startTime.
        if (curClipRelTimePosition < currentClip.duration && curClipRelTimePosition > 0) {
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

    const url = startTime ? `${currentClip.url}&t=${Math.floor(startTime)}` : currentClip.url;

    return (
        <PlayerContainer>
            <ReactPlayer
                ref={playerRef}
                url={url}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
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
                overallTime={overallTime}
                playableClipIds={playableClipIds}
                currentClipId={currentClip.id}
                onChangeClip={onChangeClip}
            />
        </PlayerContainer>
    );
};

Player.propTypes = {
    coord: PropTypes.shape({}).isRequired,
};
