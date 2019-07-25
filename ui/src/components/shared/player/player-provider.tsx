import React from 'react';

import {IsPlayingProvider, useIsPlaying, useSetIsPlaying} from './is-playing-provider';
import {PlaybackTimeProvider, usePlaybackTime, useSetPlaybackTime} from './playback-time-provider';

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
