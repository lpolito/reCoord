import React from 'react';

const StateContext = React.createContext(false);
const SetContext = React.createContext<(isPlaying: boolean) => void>((() => {}));

interface IsPlayingProviderProps {
    children: React.ReactNode;
}

export const IsPlayingProvider = ({
    children,
}: IsPlayingProviderProps) => {
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
