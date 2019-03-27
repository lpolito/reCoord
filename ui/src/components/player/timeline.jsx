import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import {grey} from '@material-ui/core/colors';

// factor by which widths & positions of clips needs to be multiplied by to fit in timeline width
// x = width of timeline / length of coord
// pixels over time
const xFactor = (coordLength) => 640 / coordLength;

// width = width of player
const TimelineContainer = styled.div`
    background-color: black;

    display: flex;
    flex-direction: column;
    flex-align: start;

    width: 640px;
    padding: 8px 0;
`;

const Clip = styled.div`
    width: ${({width}) => `${width}px`};
    margin: 2px 0;
    transform: ${({clipXPos}) => `translateX(${clipXPos}px)`};

    position: relative;
    background-color: ${({isPlayable}) => (isPlayable ? grey[100] : grey[500])};
    color: ${grey[800]};
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ClipIndicator = styled.div`
    width: 2px;
    height: 100%;
    position: absolute;
    top: 0;
    background-color: red;
`;

export const Timeline = ({
    length, clips, overallTime, playableClipIds, currentClipId, onChangeClip,
}) => (
    <TimelineContainer>
        {clips.map(({
            id, duration, timePosition, title,
        }) => {
            const clipWidth = xFactor(length) * duration;
            const clipXPos = xFactor(length) * timePosition;

            const isPlaying = currentClipId === id;
            const isPlayable = playableClipIds.includes(id);

            const currentClipProgress = isPlaying
                ? (overallTime - timePosition) / duration
                : 0;

            return (
                <Clip
                    key={id}
                    width={clipWidth}
                    clipXPos={clipXPos}
                    onClick={() => (isPlayable ? onChangeClip(id) : null)}
                    isPlayable={isPlayable}
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

Timeline.propTypes = {
    length: PropTypes.number.isRequired,
    clips: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        duration: PropTypes.number,
        timePosition: PropTypes.number,
        title: PropTypes.string,
    })).isRequired,
    overallTime: PropTypes.number.isRequired,
    playableClipIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    currentClipId: PropTypes.number.isRequired,
    onChangeClip: PropTypes.func.isRequired,
};
