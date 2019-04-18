import React from 'react';
import PropTypes from 'prop-types';

import {useInterval} from '../hooks/use-interval';

const TIME_REFRESH_SECONDS = 1;

export const TimelineContext = React.createContext();

export const TimelineProvider = ({children}) => {
    const [isPlaying, setPlaying] = React.useState(false);
    const [playbackTime, setPlaybackTime] = React.useState(0);
    const [currentClipId, setCurrentClipId] = React.useState();

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
        currentClipId,
        setCurrentClipId,
    };

    return (
        <TimelineContext.Provider value={context}>
            {children}
        </TimelineContext.Provider>
    );
};

TimelineProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
