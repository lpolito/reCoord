import React from 'react';
import styled from '@emotion/styled';

import {Player} from '../shared/player/player';

import {
    PlayerProvider,
    usePlaybackTime,
    useSetPlaybackTime,
    useSetIsPlaying,
} from '../shared/player/player-context';

import {ProgressBar} from '../shared/progressbar';
import {Timeline} from '../shared/timeline';

const ViewerContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const getPlayableClipIds = (clips: Clip[], givenTime: number) => (
    clips.filter((clip) => (
        // playbackTime falls within the bounds of a clip.
        clip.timePosition <= givenTime && (clip.timePosition + clip.duration) > givenTime
    ))
        .map((clip) => clip.id)
);

// Reference for controlling react-player.
let player: any;
const playerRef = (playerr: any) => {
    player = playerr;
};

interface ViewerProgressProps {
    coord: Coord;
    currentClip: Clip;
}

const ViewerProgress = ({
    coord,
    currentClip,
}: ViewerProgressProps) => {
    const setPlaybackTime = useSetPlaybackTime();

    /**
     * @param {number} intent Decimal of current progress bar's length.
     */
    const onSeek = (intent: number) => {
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

interface ViewerTimelineProps {
    coord: Coord;
    setStartTime: (startTime: number | null) => void;
    currentClip: Clip;
    setCurrentClip: (currentClip: Clip) => void;
}

const ViewerTimeline = ({
    coord,
    setStartTime,
    currentClip,
    setCurrentClip,
}: ViewerTimelineProps) => {
    const playbackTime = usePlaybackTime();
    const setIsPlaying = useSetIsPlaying();

    const onChangeClip = (clipId: number) => {
        if (clipId === currentClip.id) return;

        const newCurrentClip = coord.clips.find((clip) => clip.id === clipId);

        setCurrentClip(newCurrentClip!);

        const nextStartTime = playbackTime - newCurrentClip!.timePosition;
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
            const nextClipId: number | undefined = getPlayableClipIds(coord.clips, playbackTime)[0];

            if (nextClipId === undefined) {
                setIsPlaying(false);
                return;
            }

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

interface ViewerProps {
    coord: Coord;
}

export const Viewer = ({
    coord,
}: ViewerProps) => {
    const [currentClip, setCurrentClip] = React.useState(coord.clips[0]);
    const [startTime, setStartTime] = React.useState<number | null>(0);

    return (
        <ViewerContainer>
            <PlayerProvider>
                <Player
                    playerRef={playerRef}
                    url={currentClip.url}
                    startTime={startTime}
                />

                <ViewerProgress
                    coord={coord}
                    currentClip={currentClip}
                />

                <ViewerTimeline
                    coord={coord}
                    setStartTime={setStartTime}
                    currentClip={currentClip}
                    setCurrentClip={setCurrentClip}
                />

            </PlayerProvider>
        </ViewerContainer>
    );
};
