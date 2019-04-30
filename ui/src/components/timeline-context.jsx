import React from 'react';

import {useInterval} from '../hooks/use-interval';

const TIME_REFRESH_SECONDS = 1;

const TimelineContext = React.createContext();

export const TimelineProvider = (props) => {
    const [isPlaying, setPlaying] = React.useState(false);
    const [playbackTime, setPlaybackTime] = React.useState(0);

    useInterval(() => {
        setPlaybackTime(playbackTime + TIME_REFRESH_SECONDS);
    }, isPlaying ? TIME_REFRESH_SECONDS * 1000 : null);

    // Normally we'd want to useMemo around provider context.
    // Not doing this here because it has to change values frequently. It'll probably be
    // more expensive to memoize every render than to just recompute on its own (assumption).
    const context = {
        isPlaying,
        setPlaying,
        playbackTime,
        setPlaybackTime,
    };

    return (
        <TimelineContext.Provider value={context} {...props} />
    );
};

export const usePlaying = () => {
    const {isPlaying, setPlaying} = React.useContext(TimelineContext);
    return [isPlaying, setPlaying];
};

export const usePlaybackTime = () => {
    const {playbackTime, setPlaybackTime} = React.useContext(TimelineContext);
    return [playbackTime, setPlaybackTime];
};
