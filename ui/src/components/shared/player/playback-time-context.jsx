import React from 'react';
import PropTypes from 'prop-types';

import {useIsPlaying} from './is-playing-context';
import {useInterval} from '../../../hooks/use-interval';


const TIME_REFRESH_SECONDS = 1;

const StateContext = React.createContext();
const SetContext = React.createContext();

export const PlaybackTimeProvider = ({
    playbackTime: initialPlaybackTime,
    children,
}) => {
    const [playbackTime, setPlaybackTime] = React.useState(initialPlaybackTime);
    const isPlaying = useIsPlaying();

    useInterval(() => {
        setPlaybackTime((prevTime) => prevTime + TIME_REFRESH_SECONDS);
    }, isPlaying ? TIME_REFRESH_SECONDS * 1000 : null);

    return (
        <StateContext.Provider value={playbackTime}>
            <SetContext.Provider value={setPlaybackTime}>
                {children}
            </SetContext.Provider>
        </StateContext.Provider>
    );
};

PlaybackTimeProvider.propTypes = {
    playbackTime: PropTypes.number,
    children: PropTypes.node.isRequired,
};

PlaybackTimeProvider.defaultProps = {
    playbackTime: 0,
};

export const usePlaybackTime = () => React.useContext(StateContext);

export const useSetPlaybackTime = () => React.useContext(SetContext);
