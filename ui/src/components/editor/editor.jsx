import React from 'react';
import PropTypes from 'prop-types';
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


const EditorPlayers = ({
    clipA,
    startTimeA,
    clipB,
    startTimeB,
}) => (
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

EditorPlayers.propTypes = {
    clipA: PropTypes.shape({}).isRequired,
    startTimeA: PropTypes.number,
    clipB: PropTypes.shape({}).isRequired,
    startTimeB: PropTypes.number,
};

EditorPlayers.defaultProps = {
    startTimeA: null,
    startTimeB: null,
};


const EditorProgress = ({
    clipA,
    setStartTimeA,
    clipB,
    setStartTimeB,
}) => {
    const {coord} = useEditorContext();

    const isPlaying = useIsPlaying();
    const setPlaybackTime = useSetPlaybackTime();

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

EditorProgress.propTypes = {
    clipA: PropTypes.shape({}).isRequired,
    setStartTimeA: PropTypes.func.isRequired,
    clipB: PropTypes.shape({}).isRequired,
    setStartTimeB: PropTypes.func.isRequired,
};


const EditorTimeline = ({
    clipA,
    clipB,
}) => {
    const {coord} = useEditorContext();
    const playbackTime = usePlaybackTime();

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

EditorTimeline.propTypes = {
    clipA: PropTypes.shape({}).isRequired,
    clipB: PropTypes.shape({}).isRequired,
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
