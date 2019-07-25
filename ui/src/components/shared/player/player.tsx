import React from 'react';
import ReactPlayer from 'react-player';

import {usePrevious} from '../../../hooks/use-previous';
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

    const wasPlaying = usePrevious(isPlaying);

    // The player playing is independent from isPlaying, which is the actual progression of time.
    const [playerPlaying, setPlayerPlaying] = React.useState(isPlaying);

    return (
        <ReactPlayer
            ref={playerRef}
            url={urlWithStart}
            playing={playerPlaying}

            onPlay={() => {
                setPlaying(true);
                setPlayerPlaying(true);
            }}
            onPause={() => {
                setPlaying(false);
                setPlayerPlaying(false);
            }}

            // Stop progression of time when player buffers.
            onBuffer={() => setPlaying(false)}
            onBufferEnd={() => {
                // If player was playing before buffer, make sure it keeps playing.
                if (!wasPlaying) return;
                setPlaying(true);
            }}

            {...props}
        />
    );
};
