import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ReactPlayer from 'react-player';

import {usePlaying, usePlaybackTime, withTimelineContext} from '../timeline-context';

import {ProgressBar} from './progressbar';
import {Timeline} from './timeline';

const ViewerContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const getPlayableClipIds = (clips, givenTime) => clips.filter((clip) => (
    // playbackTime falls within the bounds of a clip.
    clip.timePosition <= givenTime && (clip.timePosition + clip.duration) > givenTime
)).map((clip) => clip.id);

// Reference for controlling react-player.
let player;
const playerRef = (playerr) => {
    player = playerr;
};

export const Viewer = ({coord}) => {
    const [isPlaying, setPlaying] = usePlaying();
    const [playbackTime, setPlaybackTime] = usePlaybackTime();
    const [currentClip, setCurrentClip] = React.useState(coord.clips[0]);

    const [startTime, setStartTime] = React.useState(null);

    const onChangeClip = (clipId) => {
        if (clipId === currentClip.id) return;

        const newCurrentClip = coord.clips.find((clip) => clip.id === clipId);

        setCurrentClip(newCurrentClip);

        const nextStartTime = playbackTime - newCurrentClip.timePosition;
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
        // Convert intent to playbackTime.
        const newPlaybackTime = intent * coord.length;
        setPlaybackTime(newPlaybackTime);

        const curClipRelTimePosition = (newPlaybackTime - currentClip.timePosition);
        // Only seek player if curClipRelTimePosition falls within the current clip.
        // Otherwise useEffect will automatically change the clip to the correct startTime.
        if (curClipRelTimePosition < currentClip.duration && curClipRelTimePosition > 0) {
            player.seekTo(curClipRelTimePosition);
        }
    };

    // Track playbackTime and update if clips need to be changed or the player needs to seek.
    React.useEffect(() => {
        const curClipRelTimePosition = (playbackTime - currentClip.timePosition);

        if (curClipRelTimePosition > currentClip.duration || curClipRelTimePosition < 0) {
            // playbackTime is outside of bounds of current clip, change clips.
            // Just grab and use first playable clip for now.
            const nextClipId = getPlayableClipIds(coord.clips, playbackTime)[0];
            onChangeClip(nextClipId);
        }
    }, [playbackTime, currentClip]);

    const playableClipIds = getPlayableClipIds(coord.clips, playbackTime);

    const url = startTime ? `${currentClip.url}&t=${Math.floor(startTime)}` : currentClip.url;

    return (
        <ViewerContainer>
            <ReactPlayer
                ref={playerRef}
                url={url}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                playing={isPlaying}
            />
            <ProgressBar
                length={coord.length}
                playbackTime={playbackTime}
                onSeek={onSeek}
            />
            <Timeline
                length={coord.length}
                clips={coord.clips}
                playbackTime={playbackTime}
                playableClipIds={playableClipIds}
                currentClipId={currentClip.id}
                onChangeClip={onChangeClip}
            />
        </ViewerContainer>
    );
};

Viewer.propTypes = {
    coord: PropTypes.shape({}).isRequired,
};

export const WrapperViewer = withTimelineContext(Viewer);
