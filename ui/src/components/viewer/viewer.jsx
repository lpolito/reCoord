import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import {Player} from '../shared/player';

import {PlayerProvider, useStartTime} from '../shared/player-context';
import {TimeProvider, usePlaybackTime} from '../shared/time-context';

import {ProgressBar} from '../shared/progressbar';
import {Timeline} from '../shared/timeline';

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


const ViewerPlayer = ({currentClip}) => {
    const [startTime] = useStartTime();

    return (
        <Player
            playerRef={playerRef}
            url={currentClip.url}
            startTime={startTime}
        />
    );
};


const ViewerProgress = ({coord, currentClip}) => {
    const [, setPlaybackTime] = usePlaybackTime();

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

    return (
        <ProgressBar
            length={coord.length}
            onSeek={onSeek}
        />
    );
};


const ViewerTimeline = ({coord, currentClip, setCurrentClip}) => {
    const [playbackTime] = usePlaybackTime();
    const [, setStartTime] = useStartTime();

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

    return (
        <Timeline
            length={coord.length}
            clips={coord.clips}
            playableClipIds={playableClipIds}
            currentClipId={currentClip.id}
            onChangeClip={onChangeClip}
        />
    );
};


export const Viewer = ({coord}) => {
    const [currentClip, setCurrentClip] = React.useState(coord.clips[0]);

    return (
        <ViewerContainer>
            <PlayerProvider>
                <ViewerPlayer
                    currentClip={currentClip}
                />

                <TimeProvider>
                    <ViewerProgress
                        coord={coord}
                        currentClip={currentClip}
                    />

                    <ViewerTimeline
                        coord={coord}
                        currentClip={currentClip}
                        setCurrentClip={setCurrentClip}
                    />
                </TimeProvider>

            </PlayerProvider>
        </ViewerContainer>
    );
};

Viewer.propTypes = {
    coord: PropTypes.shape({}).isRequired,
};
