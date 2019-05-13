import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

import {usePlaying} from './timeline-context';

export const Player = ({playerRef, url, ...props}) => {
    const [isPlaying, setPlaying] = usePlaying();

    return (
        <ReactPlayer
            ref={playerRef}
            url={url}
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
};
