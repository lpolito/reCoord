import React from 'react';
import PropTypes from 'prop-types';

import {useInterval} from '../../hooks/use-interval';
import {usePlaying} from './player-context';

const TIME_REFRESH_SECONDS = 1;

const TimeContext = React.createContext();

export const TimeProvider = ({
    playbackTime: initialPlaybackTime,
    ...props
}) => {
    const [playbackTime, setPlaybackTime] = React.useState(initialPlaybackTime);
    const [isPlaying] = usePlaying();

    useInterval(() => {
        setPlaybackTime(playbackTime + TIME_REFRESH_SECONDS);
    }, isPlaying ? TIME_REFRESH_SECONDS * 1000 : null);

    // Normally we'd want to useMemo around provider context.
    // Not doing this here because it has to change values frequently. It'll probably be
    // more expensive to memoize every render than to just recompute on its own (assumption).
    const context = {
        playbackTime,
        setPlaybackTime,
    };

    return (
        <TimeContext.Provider value={context} {...props} />
    );
};

TimeProvider.propTypes = {
    playbackTime: PropTypes.number,
    children: PropTypes.node.isRequired,
};

TimeProvider.defaultProps = {
    playbackTime: 0,
};


export const useTimeContext = () => React.useContext(TimeContext);

export const usePlaybackTime = () => {
    const {playbackTime, setPlaybackTime} = useTimeContext();
    return [playbackTime, setPlaybackTime];
};


export const withTimeContext = (Component) => (
    (props) => (
        <TimeProvider>
            <Component {...props} />
        </TimeProvider>
    )
);
