import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ReactPlayer from 'react-player';

import {ProgressBar} from '../player/progressbar';
import {Timeline} from './timeline';
import {useInterval} from '../../hooks/use-interval';


const TIME_REFRESH_SECONDS = 1;

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

// const getPlayableClipIds = (clips, givenTime) => clips.filter((clip) => (
//     // overallTime falls within the bounds of a clip.
//     clip.timePosition <= givenTime && (clip.timePosition + clip.duration) > givenTime
// )).map((clip) => clip.id);

// Reference for controlling react-player.
let playerA;
const playerRefA = (playerrA) => {
    playerA = playerrA;
};

let playerB;
const playerRefB = (playerrB) => {
    playerB = playerrB;
};

export const Editor = ({coord}) => {
    const [isPlaying, setPlaying] = React.useState(false);
    const [overallTime, setOverallTime] = React.useState(0);
    const [startTime, setStartTime] = React.useState(null);

    const [currentClipA, setCurrentClipA] = React.useState(coord.clips[0]);
    const [currentClipB, setCurrentClipB] = React.useState(coord.clips[1]);


    useInterval(() => {
        setOverallTime(overallTime + TIME_REFRESH_SECONDS);
    }, isPlaying ? TIME_REFRESH_SECONDS * 1000 : null);

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

    const selectedClips = [currentClipA.id, currentClipB.id];

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
                    length={coord.length}
                    clips={coord.clips}
                    overallTime={overallTime}
                    selectedClips={selectedClips}
                    // playableClipIds={playableClipIds}
                    // currentClipId={currentClip.id}
                    // onChangeClip={onChangeClip}
                />
            </TimelineFixedWidth>
        </EditorContainer>
    );
};

Editor.propTypes = {
    coord: PropTypes.shape({}).isRequired,
};
