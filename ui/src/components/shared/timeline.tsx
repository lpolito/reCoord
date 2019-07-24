import React from 'react';
import styled from '@emotion/styled';

import {grey} from '@material-ui/core/colors';

import {usePlaybackTime} from './player/player-context';


// factor by which widths & positions of clips needs to be multiplied by to fit in timeline width
// x = width of timeline / length of coord
// pixels over time
const xFactor = (coordLength: number) => 640 / coordLength;

// width = width of player
const TimelineContainer = styled.div`
    background-color: black;

    display: flex;
    flex-direction: column;

    width: 640px;
    padding: 8px 0;
`;

interface ClipProps {
    clipId?: number;
    isPlayable?: boolean;
    clipStyle?: any;
}

const Clip = styled.div<ClipProps>`
    height: 15px;
    margin: 2px 0;

    position: relative;
    background-color: ${({isPlayable}) => (isPlayable ? grey[100] : grey[500])};
    color: ${grey[800]};
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
    ${({clipStyle}) => clipStyle}
`;

const ClipIndicator = styled.div`
    width: 2px;
    height: 100%;
    position: absolute;
    top: 0;
    background-color: red;
`;

interface TimelineProps {
    length: number;
    clips: Clip[];
    playableClipIds: number[];
    currentClipId?: number;
    onChangeClip: (id: number) => void;
    clipStyle?: any;
}

export const Timeline = ({
    length,
    clips,
    playableClipIds = [],
    currentClipId = undefined,
    onChangeClip = () => {},
    clipStyle = {},
}: TimelineProps) => {
    const playbackTime = usePlaybackTime();

    return (
        <TimelineContainer>
            {clips.map(({
                id, duration, timePosition, title,
            }) => {
                const clipWidth = xFactor(length) * duration;
                const clipXPos = xFactor(length) * timePosition;

                const isPlaying = currentClipId === id;
                const isPlayable = playableClipIds.includes(id);

                const currentClipProgress = isPlaying
                    ? (playbackTime - timePosition) / duration
                    : 0;

                return (
                    <Clip
                        key={id}
                        onClick={() => (isPlayable ? onChangeClip(id) : null)}
                        isPlayable={isPlayable}
                        style={{
                            width: `${clipWidth}px`,
                            transform: `translateX(${clipXPos}px)`,
                        }}
                        clipId={id}
                        clipStyle={clipStyle}
                    >
                        {title}
                        {isPlaying && (
                            <ClipIndicator
                                style={{transform: `translateX(${clipWidth * currentClipProgress}px)`}}
                            />
                        )}
                    </Clip>
                );
            })}
        </TimelineContainer>
    );
};
