import React from 'react';

import {useIsPlaying} from './is-playing-context';
import {useInterval} from '../../../hooks/use-interval';


const TIME_REFRESH_SECONDS = 1;

const StateContext = React.createContext(0);
const SetContext = React.createContext<(playbackTime: number) => void>(() => {});

interface PlaybackTimeProviderProps {
    playbackTime: number;
    children: React.ReactNode;
}

export const PlaybackTimeProvider = ({
    playbackTime: initialPlaybackTime = 0,
    children,
}: PlaybackTimeProviderProps) => {
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

export const usePlaybackTime = () => React.useContext(StateContext);

export const useSetPlaybackTime = () => React.useContext(SetContext);
