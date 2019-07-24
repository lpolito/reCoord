import React from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

import {red, green} from '@material-ui/core/colors';

import {useEditorContext} from './editor-context';
import {
    PlayerProvider,
    useIsPlaying,
    usePlaybackTime,
    useSetPlaybackTime,
} from '../shared/player/player-context';

import {Player} from '../shared/player/player';
import {ProgressBar} from '../shared/progressbar';
import {Timeline} from '../shared/timeline';
import {TimelineEditorControls} from './timeline-editor-controls';

import {useLazyInit} from '../../hooks/use-lazy-init';


const EditorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const PlayerSideBySide = styled.div`
    display: flex;
    flex-direction: row;
`;

const TimelineFixedWidth = styled.div`
    width: 640px;
`;

const PlayerA = styled(Player)`
    border: 1px solid ${red[200]};
`;

const PlayerB = styled(Player)`
    border: 1px solid ${green[200]};
`;

// Reference for controlling react-player.
let playerA: any;
const playerRefA = (playerrA: any) => {
    playerA = playerrA;
};

let playerB: any;
const playerRefB = (playerrB: any) => {
    playerB = playerrB;
};


interface SeekPlayersArgs {
    playbackTime: number;
    clipA: Clip;
    clipB: Clip;
}

const seekPlayers = ({playbackTime, clipA, clipB}: SeekPlayersArgs) => {
    // playerA
    const curClipRelTimePositionA = (playbackTime - clipA.timePosition);
    // Seek player if curClipRelTimePosition falls within the current clip.
    if (curClipRelTimePositionA < clipA.duration && curClipRelTimePositionA > 0) {
        playerA.seekTo(curClipRelTimePositionA);
    }

    // playerB
    const curClipRelTimePositionB = (playbackTime - clipB.timePosition);
    // Seek player if curClipRelTimePosition falls within the current clip.
    if (curClipRelTimePositionB < clipB.duration && curClipRelTimePositionB > 0) {
        playerB.seekTo(curClipRelTimePositionB);
    }
};

const calculateStartTime = (newPlaybackTime: number, clipTimePosition: number) => {
    const nextStartTime = newPlaybackTime - clipTimePosition;

    return nextStartTime > 1 ? Math.floor(nextStartTime) : null;
};


interface EditorPlayersProps {
    clipA: Clip;
    startTimeA: number | null;
    clipB: Clip;
    startTimeB: number | null;
}

const EditorPlayers = ({
    clipA,
    startTimeA = null,
    clipB,
    startTimeB = null,
}: EditorPlayersProps) => (
    <PlayerSideBySide>
        <PlayerA
            playerRef={playerRefA}
            url={clipA.url}
            startTime={startTimeA}
        />
        <PlayerB
            playerRef={playerRefB}
            url={clipB.url}
            startTime={startTimeB}
        />
    </PlayerSideBySide>
);

interface EditorProgressProps {
    clipA: Clip;
    setStartTimeA: (startTime: number | null) => void;
    clipB: Clip;
    setStartTimeB: (startTime: number | null) => void;
}

const EditorProgress = ({
    clipA,
    setStartTimeA,
    clipB,
    setStartTimeB,
}: EditorProgressProps) => {
    const {coord} = useEditorContext();

    const isPlaying = useIsPlaying();
    const setPlaybackTime = useSetPlaybackTime();

    /**
     * @param {number} intent Decimal of current progress bar's length.
     */
    const onSeek = (intent: number) => {
        // Convert intent to playbackTime.
        const newPlaybackTime = intent * coord.length;
        setPlaybackTime(newPlaybackTime);

        if (isPlaying) {
            seekPlayers({playbackTime: newPlaybackTime, clipA, clipB});
        } else {
            setStartTimeA(calculateStartTime(newPlaybackTime, clipA.timePosition));
            setStartTimeB(calculateStartTime(newPlaybackTime, clipB.timePosition));
        }
    };

    return (
        <ProgressBar
            length={coord.length}
            onSeek={onSeek}
        />
    );
};

interface EditorTimelineProps {
    clipA: Clip;
    clipB: Clip;
}

const EditorTimeline = ({
    clipA,
    clipB,
}: EditorTimelineProps) => {
    const {coord} = useEditorContext();
    const playbackTime = usePlaybackTime();

    const clipIds = React.useMemo(() => coord.clips.map((clip) => clip.id), [coord.clips]);

    return (
        <TimelineEditorControls
            onChange={() => {
                seekPlayers({playbackTime, clipA, clipB});
            }}
        >
            <Timeline
                length={coord.length}
                clips={coord.clips}
                clipStyle={({clipId}: {clipId: number}) => css`
                    background-color: ${clipId === clipA.id ? red[200] : undefined};
                    background-color: ${clipId === clipB.id ? green[200] : undefined};
                `}
                playableClipIds={clipIds}
                onChangeClip={(id: number) => console.log({id})}
            />
        </TimelineEditorControls>
    );
};


export const Editor = () => {
    const {coord} = useEditorContext();

    const [initialClipA, initialClipB] = useLazyInit([coord.clips[0], coord.clips[1]]);

    // Set initial playbackTime to the latest (in time) clip.
    const initialPlaybackTime = useLazyInit(Math.max(initialClipA.timePosition, initialClipB.timePosition));

    // TODO make this dependend on the actual selected clip.
    const [startTimeA, setStartTimeA] = React.useState(
        calculateStartTime(initialPlaybackTime, initialClipA.timePosition)
    );
    const [startTimeB, setStartTimeB] = React.useState(
        calculateStartTime(initialPlaybackTime, initialClipB.timePosition)
    );

    // TODO make sure these selected clips are coming from editorContext.
    const [clipA, clipB] = coord.clips;

    return (
        <EditorContainer>
            <PlayerProvider playbackTime={initialPlaybackTime}>
                <EditorPlayers
                    clipA={clipA}
                    startTimeA={startTimeA}
                    clipB={clipB}
                    startTimeB={startTimeB}
                />

                <TimelineFixedWidth>
                    <EditorProgress
                        clipA={clipA}
                        setStartTimeA={setStartTimeA}
                        clipB={clipB}
                        setStartTimeB={setStartTimeB}
                    />

                    <EditorTimeline clipA={clipA} clipB={clipB} />
                </TimelineFixedWidth>

            </PlayerProvider>
        </EditorContainer>
    );
};
