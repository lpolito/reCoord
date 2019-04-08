import React from 'react';
import styled from '@emotion/styled';

import ReactPlayer from 'react-player';

import {EditorContext} from './editor-context';
import {TimelineContext} from '../timeline-context';
import {ProgressBar} from '../player/progressbar';
import {Timeline} from './timeline';


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

export const Editor = () => {
    const {coord, editorClips} = React.useContext(EditorContext);
    const {
        isPlaying, setPlaying,
        overallTime, setOverallTime,
        // Default the currentClipIds to a tuple of which clips editor is displaying.
        currentClipId: currentClipIds = [editorClips[0].id, editorClips[1].id],
    } = React.useContext(TimelineContext);

    const currentClipA = React.useMemo(() => (
        editorClips.find((clip) => clip.id === currentClipIds[0])
    ), [currentClipIds]);
    const currentClipB = React.useMemo(() => (
        editorClips.find((clip) => clip.id === currentClipIds[1])
    ), [currentClipIds]);

    /**
     * @param {number} intent Decimal of current progress bar's length.
     */
    const onSeek = (intent) => {
        // Convert intent to overallTime.
        const newOverallTime = intent * coord.length;
        setOverallTime(newOverallTime);

        // playerA
        const curClipRelTimePositionA = (newOverallTime - currentClipA.timePosition);
        // Only seek player if curClipRelTimePosition falls within the current clip.
        // Otherwise useEffect will automatically change the clip to the correct startTime.
        if (curClipRelTimePositionA < currentClipA.duration && curClipRelTimePositionA > 0) {
            playerA.seekTo(curClipRelTimePositionA);
        }

        // playerB
        const curClipRelTimePositionB = (newOverallTime - currentClipB.timePosition);
        // Only seek player if curClipRelTimePosition falls within the current clip.
        // Otherwise useEffect will automatically change the clip to the correct startTime.
        if (curClipRelTimePositionB < currentClipB.duration && curClipRelTimePositionB > 0) {
            playerB.seekTo(curClipRelTimePositionB);
        }
    };

    return (
        <EditorContainer>
            <PlayerSideBySide>
                <ReactPlayer
                    ref={playerRefA}
                    url={currentClipA.url}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    playing={isPlaying}
                />
                <ReactPlayer
                    ref={playerRefB}
                    url={currentClipB.url}
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
                <Timeline
                    overallTime={overallTime}
                    selectedClips={currentClipIds}
                />
            </TimelineFixedWidth>
        </EditorContainer>
    );
};
