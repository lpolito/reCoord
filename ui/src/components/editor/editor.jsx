import React from 'react';
import styled from '@emotion/styled';

import ReactPlayer from 'react-player';

import {EditorContext} from './editor-context';
import {TimelineContext} from '../timeline-context';
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

// Reference for controlling react-player.
let playerA;
const playerRefA = (playerrA) => {
    playerA = playerrA;
};

let playerB;
const playerRefB = (playerrB) => {
    playerB = playerrB;
};

const seekPlayers = ({overallTime, clipA, clipB}) => {
    // playerA
    const curClipRelTimePositionA = (overallTime - clipA.timePosition);
    // Seek player if curClipRelTimePosition falls within the current clip.
    if (curClipRelTimePositionA < clipA.duration && curClipRelTimePositionA > 0) {
        playerA.seekTo(curClipRelTimePositionA);
    }

    // playerB
    const curClipRelTimePositionB = (overallTime - clipB.timePosition);
    // Seek player if curClipRelTimePosition falls within the current clip.
    if (curClipRelTimePositionB < clipB.duration && curClipRelTimePositionB > 0) {
        playerB.seekTo(curClipRelTimePositionB);
    }
};

export const Editor = () => {
    const {coord} = React.useContext(EditorContext);

    const {
        isPlaying, setPlaying,
        overallTime, setOverallTime,
        // Default the currentClipIds to a tuple of which clips editor is displaying.
        currentClipId: currentClipIds = [coord.clips[0].id, coord.clips[1].id],
    } = React.useContext(TimelineContext);

    const [startTimes, setStartTimes] = React.useState([null, null]);

    const currentClipA = React.useMemo(() => (
        coord.clips.find((clip) => clip.id === currentClipIds[0])
    ), [currentClipIds]);
    const currentClipB = React.useMemo(() => (
        coord.clips.find((clip) => clip.id === currentClipIds[1])
    ), [currentClipIds]);

    React.useEffect(() => {
        // Set initial overallTime to the latest clip.
        const newOverallTime = Math.max(currentClipA.timePosition, currentClipB.timePosition);
        setOverallTime(newOverallTime);

        // Start clips at appropriate times.
        const nextStartTimeA = newOverallTime - currentClipA.timePosition;
        const nextStartTimeB = newOverallTime - currentClipB.timePosition;

        setStartTimes([
            nextStartTimeA > 1 ? nextStartTimeA : null,
            nextStartTimeB > 1 ? nextStartTimeB : null,
        ]);
    }, []);

    /**
     * @param {number} intent Decimal of current progress bar's length.
     */
    const onSeek = (intent) => {
        // Convert intent to overallTime.
        const newOverallTime = intent * coord.length;
        setOverallTime(newOverallTime);

        seekPlayers({
            overallTime: newOverallTime,
            clipA: currentClipA,
            clipB: currentClipB,
        });
    };

    const urlA = startTimes[0] ? `${currentClipA.url}&t=${Math.floor(startTimes[0])}` : currentClipA.url;
    const urlB = startTimes[1] ? `${currentClipB.url}&t=${Math.floor(startTimes[1])}` : currentClipB.url;

    return (
        <EditorContainer>
            <PlayerSideBySide>
                <ReactPlayer
                    ref={playerRefA}
                    url={urlA}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    playing={isPlaying}
                />
                <ReactPlayer
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
                    overallTime={overallTime}
                    onSeek={onSeek}
                />
                <TimelineEditor
                    onChange={() => seekPlayers({
                        overallTime,
                        clipA: currentClipA,
                        clipB: currentClipB,
                    })}
                >
                    <Timeline
                        length={coord.length}
                        clips={coord.clips}
                        overallTime={overallTime}
                        playableClipIds={[]}
                        // currentClipId={currentClipId}
                        // onChangeClip={onChangeClip}
                    />
                </TimelineEditor>
            </TimelineFixedWidth>
        </EditorContainer>
    );
};
