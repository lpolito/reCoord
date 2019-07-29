import React from 'react';

import ReactPlayer from 'react-player';
import {uniqueId} from 'lodash';

import {
    useIsPlaying,
    usePlayerSetters,
} from './player-provider';
import {useOnUpdateEffect} from '../../../hooks/use-on-update';


export interface PlayerProps {
    clip: Clip;
    startTime: number | null;
}

export const Player = ({
    clip,
    startTime = null,
    ...props
}: PlayerProps) => {
    const isTimeProgressing = useIsPlaying();
    const {
        addPlayer,
        setPlaying: setTimeProgressing,
    } = usePlayerSetters();

    // The player playing is independent from isPlaying, which is the actual progression of time.
    const [playerPlaying, setPlayerPlaying] = React.useState(isTimeProgressing);
    const [isBuffering, setBuffering] = React.useState(false);
    const [playerId] = React.useState(uniqueId('player-id-'));
    const playerRef = React.useRef<ReactPlayer | null>();

    React.useEffect(() => {
        addPlayer({
            clip,
            id: playerId,
            playerRef: playerRef.current,
            startTime,
        });
    }, []);

    const urlWithStart = React.useMemo(() => (
        startTime ? `${clip.url}&t=${startTime}` : clip.url
    ), [startTime, clip.url]);

    useOnUpdateEffect(() => {
        setTimeProgressing(!isBuffering && playerPlaying);
    }, [isBuffering, playerPlaying]);

    return (
        <ReactPlayer
            ref={(node) => {
                playerRef.current = node;
            }}
            url={urlWithStart}
            playing={playerPlaying}

            onPlay={() => {
                setPlayerPlaying(true);
            }}
            onPause={() => {
                setPlayerPlaying(false);
            }}

            onBuffer={() => {
                setBuffering(true);
            }}
            onBufferEnd={() => {
                setBuffering(false);
            }}

            {...props}
        />
    );
};
