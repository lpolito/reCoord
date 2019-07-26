import React from 'react';

import ReactPlayer from 'react-player';
import {uniqueId} from 'lodash';

import {usePrevious} from '../../../hooks/use-previous';
import {
    useIsPlaying,
    usePlayerActions,
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
    const isPlaying = useIsPlaying();
    const {
        addPlayer,
        setPlaying,
    } = usePlayerActions();

    // The player playing is independent from isPlaying, which is the actual progression of time.
    const [playerPlaying, setPlayerPlaying] = React.useState(isPlaying);
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

    // TODO why is this necessary when it wasn't before?
    useOnUpdateEffect(() => {
        setPlayerPlaying(isPlaying);
    }, [isPlaying]);

    const urlWithStart = React.useMemo(() => (
        startTime ? `${clip.url}&t=${startTime}` : clip.url
    ), [startTime, clip.url]);

    const wasPlaying = usePrevious(isPlaying);

    return (
        <ReactPlayer
            ref={(node) => {
                playerRef.current = node;
            }}
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
