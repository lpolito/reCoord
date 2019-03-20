import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import {grey} from '@material-ui/core/colors';

// factor by which widths & positions of clips needs to be multiplied by to fit in timeline width
// x = width of timeline / length of coord
const xFactor = (coordLength) => 640 / coordLength;

// width = width of player
const TimelineContainer = styled.div`
    background-color: black;

    display: flex;
    flex-direction: column;
    flex-align: start;

    width: 640px;
`;

const Clip = styled.div`
    width: ${({length, duration}) => `${xFactor(length) * duration}px`};
    margin: 2px;
    margin-left: ${(({length, xPosition}) => `${xFactor(length) * xPosition}px`)};

    position: relative;
    background-color: ${grey[100]};
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
    length, clips, clipProgress, onChange, currentClipId,
}) => (
    <TimelineContainer>
        {clips.map(({
            id, duration, xPosition, title,
        }) => (
            <Clip
                key={id}
                duration={duration}
                length={length}
                xPosition={xPosition}
                onClick={() => onChange(id)}
            >
                {title}
                {currentClipId === id && (
                    <ClipIndicator style={{left: `${clipProgress * 100}%`}} />
                )}
            </Clip>
        ))}
    </TimelineContainer>
);

Timeline.propTypes = {
    length: PropTypes.number.isRequired,
    clips: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        duration: PropTypes.number,
        xPosition: PropTypes.number,
        title: PropTypes.string,
    })).isRequired,
    clipProgress: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    currentClipId: PropTypes.number.isRequired,
};
