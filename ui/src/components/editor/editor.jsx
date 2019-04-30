import React from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

import ReactPlayer from 'react-player';
import {red, green} from '@material-ui/core/colors';

import {EditorContext} from './editor-context';
import {usePlaying, usePlaybackTime} from '../timeline-context';
import {ProgressBar} from '../player/progressbar';
import {Timeline} from '../player/timeline';
import {TimelineEditor} from './timeline-editor';


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

const PlayerA = styled(ReactPlayer)`
    border: 1px solid ${red[200]};
`;

const PlayerB = styled(ReactPlayer)`
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

export const Editor = () => {
    const {coord} = React.useContext(EditorContext);

    const [isPlaying, setPlaying] = usePlaying();
    const [playbackTime, setPlaybackTime] = usePlaybackTime();
    const [clipA] = React.useState(coord.clips[0]);
    const [clipB] = React.useState(coord.clips[1]);

    const [startTimes, setStartTimes] = React.useState([null, null]);

    const updateStartTime = (newPlaybackTime) => {
        const nextStartTimeA = newPlaybackTime - clipA.timePosition;
        const nextStartTimeB = newPlaybackTime - clipB.timePosition;

        setStartTimes([
            nextStartTimeA > 1 ? Math.floor(nextStartTimeA) : null,
            nextStartTimeB > 1 ? Math.floor(nextStartTimeB) : null,
        ]);
    };

    React.useEffect(() => {
        // Set initial playbackTime to the latest clip.
        const newPlaybackTime = Math.max(clipA.timePosition, clipB.timePosition);
        setPlaybackTime(newPlaybackTime);

        updateStartTime(newPlaybackTime);
    }, []);

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
            updateStartTime(newPlaybackTime);
        }
    };

    const urlA = React.useMemo(() => (
        startTimes[0] ? `${clipA.url}&t=${startTimes[0]}` : clipA.url
    ), [startTimes, clipA]);

    const urlB = React.useMemo(() => (
        startTimes[1] ? `${clipB.url}&t=${startTimes[1]}` : clipB.url
    ), [startTimes, clipB]);

    const clipIds = React.useMemo(() => coord.clips.map((clip) => clip.id), [coord.clips]);

    return (
        <EditorContainer>
            <PlayerSideBySide>
                <PlayerA
                    ref={playerRefA}
                    url={urlA}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    playing={isPlaying}
                />
                <PlayerB
                    ref={playerRefB}
                    url={urlB}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    playing={isPlaying}
                />
            </PlayerSideBySide>
            <TimelineFixedWidth>
                <ProgressBar
                    length={coord.length}
                    playbackTime={playbackTime}
                    onSeek={onSeek}
                />
                <TimelineEditor
                    onChange={() => seekPlayers({playbackTime, clipA, clipB})}
                >
                    <Timeline
                        length={coord.length}
                        clips={coord.clips}
                        playbackTime={playbackTime}
                        clipStyle={({id}) => css`
                            background-color: ${id === clipA.id ? red[200] : undefined};
                            background-color: ${id === clipB.id ? green[200] : undefined};
                        `}
                        playableClipIds={clipIds}
                        onChangeClip={(id) => console.log({id})}
                    />
                </TimelineEditor>
            </TimelineFixedWidth>
        </EditorContainer>
    );
};
