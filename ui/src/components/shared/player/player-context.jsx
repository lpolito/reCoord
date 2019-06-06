import React from 'react';
import PropTypes from 'prop-types';

import {IsPlayingProvider, useIsPlaying, useSetIsPlaying} from './is-playing-context';
import {PlaybackTimeProvider, usePlaybackTime, useSetPlaybackTime} from './playback-time-context';

export const PlayerProvider = ({
    playbackTime: initialPlaybackTime,
    children,
}) => (
    <IsPlayingProvider>
        <PlaybackTimeProvider playbackTime={initialPlaybackTime}>
            {children}
        </PlaybackTimeProvider>
    </IsPlayingProvider>
);

PlayerProvider.propTypes = {
    playbackTime: PropTypes.number,
    children: PropTypes.node.isRequired,
};

PlayerProvider.defaultProps = {
    playbackTime: 0,
};

export {
    useIsPlaying,
    useSetIsPlaying,
    usePlaybackTime,
    useSetPlaybackTime,
};
