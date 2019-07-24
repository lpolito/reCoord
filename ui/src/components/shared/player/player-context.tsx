import React from 'react';

import {IsPlayingProvider, useIsPlaying, useSetIsPlaying} from './is-playing-context';
import {PlaybackTimeProvider, usePlaybackTime, useSetPlaybackTime} from './playback-time-context';

interface PlayerProviderProps {
    playbackTime?: number;
    children: React.ReactNode;
}

export const PlayerProvider = ({
    playbackTime: initialPlaybackTime = 0,
    children,
}: PlayerProviderProps) => (
    <IsPlayingProvider>
        <PlaybackTimeProvider playbackTime={initialPlaybackTime}>
            {children}
        </PlaybackTimeProvider>
    </IsPlayingProvider>
);

export {
    useIsPlaying,
    useSetIsPlaying,
    usePlaybackTime,
    useSetPlaybackTime,
};
