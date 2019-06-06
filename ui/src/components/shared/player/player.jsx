import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

import {useIsPlaying, useSetIsPlaying} from './player-context';

export const Player = ({
    playerRef, url, startTime, ...props
}) => {
    const isPlaying = useIsPlaying();
    const setPlaying = useSetIsPlaying();

    const urlWithStart = React.useMemo(() => (
        startTime ? `${url}&t=${startTime}` : url
    ), [startTime, url]);

    return (
        <ReactPlayer
            ref={playerRef}
            url={urlWithStart}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            playing={isPlaying}
            {...props}
        />
    );
};

Player.propTypes = {
    playerRef: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
    startTime: PropTypes.number,
};

Player.defaultProps = {
    startTime: null,
};
