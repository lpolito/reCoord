import React from 'react';
import PropTypes from 'prop-types';

import {useInterval} from '../hooks/use-interval';

const TIME_REFRESH_SECONDS = 1;

export const TimelineContext = React.createContext();

export const TimelineProvider = ({children}) => {
    // const {initialClip = coord.clips[0]} = options;

    const [isPlaying, setPlaying] = React.useState(false);
    const [overallTime, setOverallTime] = React.useState(0);
    const [currentClipId, setCurrentClipId] = React.useState();

    useInterval(() => {
        setOverallTime(overallTime + TIME_REFRESH_SECONDS);
    }, isPlaying ? TIME_REFRESH_SECONDS * 1000 : null);

    const providerValues = {
        isPlaying,
        setPlaying,
        overallTime,
        setOverallTime,
        currentClipId,
        setCurrentClipId,
    };

    return (
        <TimelineContext.Provider value={providerValues}>
            {children}
        </TimelineContext.Provider>
    );
};

TimelineProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
