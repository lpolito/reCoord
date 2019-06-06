import React from 'react';
import PropTypes from 'prop-types';


const StateContext = React.createContext();
const SetContext = React.createContext();

export const IsPlayingProvider = ({children}) => {
    const [isPlaying, setPlaying] = React.useState(false);

    return (
        <StateContext.Provider value={isPlaying}>
            <SetContext.Provider value={setPlaying}>
                {children}
            </SetContext.Provider>
        </StateContext.Provider>
    );
};

IsPlayingProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useIsPlaying = () => React.useContext(StateContext);

export const useSetIsPlaying = () => React.useContext(SetContext);
