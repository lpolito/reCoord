import React from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

import {red, green} from '@material-ui/core/colors';

import {useEditorContext} from './editor-context';
import {TimeProvider, usePlaybackTime} from '../shared/time-context';
import {PlayerProvider, usePlaying, useStartTime} from '../shared/player-context';

import {Player} from '../shared/player';
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
let playerA;
const playerRefA = (playerrA) => {
    playerA = playerrA;
};

let playerB;
const playerRefB = (playerrB) => {
    playerB = playerrB;
};


const seekPlayers = ({playbackTime, clipA, clipB}) => {
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

const calculateStartTime = (newPlaybackTime, clipTimePosition) => {
    const nextStartTime = newPlaybackTime - clipTimePosition;

    return nextStartTime > 1 ? Math.floor(nextStartTime) : null;
};


const Players = ({clipA, clipB}) => {
    const [startTimes] = useStartTime();

    return (
        <PlayerSideBySide>
            <PlayerA
                playerRef={playerRefA}
                url={clipA.url}
                startTime={startTimes[0]}
            />
            <PlayerB
                playerRef={playerRefB}
                url={clipB.url}
                startTime={startTimes[1]}
            />
        </PlayerSideBySide>
    );
};


const EditorProgress = ({clipA, clipB}) => {
    const {coord} = useEditorContext();

    const [isPlaying] = usePlaying();
    const [, setStartTimes] = useStartTime();
    const [, setPlaybackTime] = usePlaybackTime();

    /**
     * @param {number} intent Decimal of current progress bar's length.
     */
    const onSeek = (intent) => {
        // Convert intent to playbackTime.
        const newPlaybackTime = intent * coord.length;
        setPlaybackTime(newPlaybackTime);

        if (isPlaying) {
            seekPlayers({playbackTime: newPlaybackTime, clipA, clipB});
        } else {
            setStartTimes([
                calculateStartTime(newPlaybackTime, clipA.timePosition),
                calculateStartTime(newPlaybackTime, clipB.timePosition),
            ]);
        }
    };

    return (
        <ProgressBar
            length={coord.length}
            onSeek={onSeek}
        />
    );
};


const EditorTimeline = ({clipA, clipB}) => {
    const {coord} = useEditorContext();
    const [playbackTime] = usePlaybackTime();

    const clipIds = React.useMemo(() => coord.clips.map((clip) => clip.id), [coord.clips]);

    return (
        <TimelineEditorControls
            onChange={() => seekPlayers({playbackTime, clipA, clipB})}
        >
            <Timeline
                length={coord.length}
                clips={coord.clips}
                clipStyle={({id}) => css`
                    background-color: ${id === clipA.id ? red[200] : undefined};
                    background-color: ${id === clipB.id ? green[200] : undefined};
                `}
                playableClipIds={clipIds}
                onChangeClip={(id) => console.log({id})}
            />
        </TimelineEditorControls>
    );
};


export const Editor = () => {
    const {coord} = useEditorContext();

    const [clipA] = React.useState(coord.clips[0]);
    const [clipB] = React.useState(coord.clips[1]);

    // Set initial playbackTime to the latest clip.
    const initialPlaybackTime = useLazyInit(Math.max(clipA.timePosition, clipB.timePosition));

    // Set initial playbackTime to the latest clip.
    const initialStartTime = useLazyInit([
        calculateStartTime(initialPlaybackTime, clipA.timePosition),
        calculateStartTime(initialPlaybackTime, clipB.timePosition),
    ]);

    return (
        <EditorContainer>
            <PlayerProvider
                startTime={initialStartTime}
            >
                <Players
                    clipA={clipA}
                    clipB={clipB}
                />

                <TimeProvider
                    playbackTime={initialPlaybackTime}
                >
                    <TimelineFixedWidth>
                        <EditorProgress
                            clipA={clipA}
                            clipB={clipB}
                        />

                        <EditorTimeline
                            clipA={clipA}
                            clipB={clipB}
                        />
                    </TimelineFixedWidth>
                </TimeProvider>

            </PlayerProvider>
        </EditorContainer>
    );
};
