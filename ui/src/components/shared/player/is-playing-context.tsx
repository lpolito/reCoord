import React from 'react';

const StateContext = React.createContext(false);
const SetContext = React.createContext<(isPlaying: boolean) => void>((() => {}));

export const IsPlayingProvider = ({children}: {children: React.ReactNode}) => {
    const [isPlaying, setPlaying] = React.useState(false);

    return (
        <StateContext.Provider value={isPlaying}>
            <SetContext.Provider value={setPlaying}>
                {children}
            </SetContext.Provider>
        </StateContext.Provider>
    );
};

export const useIsPlaying = () => React.useContext(StateContext);

export const useSetIsPlaying = () => React.useContext(SetContext);
