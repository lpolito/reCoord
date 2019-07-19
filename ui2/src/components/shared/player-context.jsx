import React from 'react';
import PropTypes from 'prop-types';


const PlayerContext = React.createContext();

export const PlayerProvider = ({
    startTime: initialStartTime,
    ...props
}) => {
    const [isPlaying, setPlaying] = React.useState(false);
    const [startTime, setStartTime] = React.useState(initialStartTime);

    // Normally we'd want to useMemo around provider context.
    // Not doing this here because it has to change values frequently. It'll probably be
    // more expensive to memoize every render than to just recompute on its own (assumption).
    const context = {
        isPlaying,
        setPlaying,
        startTime,
        setStartTime,
    };

    return (
        <PlayerContext.Provider value={context} {...props} />
    );
};

PlayerProvider.propTypes = {
    startTime: PropTypes.oneOfType([
        PropTypes.number, PropTypes.arrayOf(PropTypes.number),
    ]),
    children: PropTypes.node.isRequired,
};

PlayerProvider.defaultProps = {
    startTime: null,
};


export const usePlayerContext = () => React.useContext(PlayerContext);

export const usePlaying = () => {
    const {isPlaying, setPlaying} = usePlayerContext();
    return [isPlaying, setPlaying];
};

export const useStartTime = () => {
    const {startTime, setStartTime} = usePlayerContext();
    return [startTime, setStartTime];
};
