import React from 'react';
import ReactPlayer from 'react-player';

import {useIsPlaying, useSetIsPlaying} from './player-context';

interface PlayerProps {
    playerRef: any;
    url: string;
    startTime: number | null;
}

export const Player = ({
    playerRef,
    url,
    startTime = null,
    ...props
}: PlayerProps) => {
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
