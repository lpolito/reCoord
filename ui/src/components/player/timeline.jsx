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

const Progress = styled.div`
    color: white;
`;

const Clip = styled.div`
    width: ${({length, duration}) => `${xFactor(length) * duration}px`};
    margin: 2px;
    margin-left: ${(({length, xPosition}) => `${xFactor(length) * xPosition}px`)};

    background-color: ${grey[100]};
    color: ${grey[800]};
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const Timeline = ({
    length, clips, progress, onChange,
}) => (
    <TimelineContainer>
        <Progress>{progress.playedSeconds}</Progress>
        {clips.map(({
            id, url, duration, xPosition, title,
        }) => (
            <Clip
                key={id}
                duration={duration}
                length={length}
                xPosition={xPosition}
                onClick={() => onChange(url)}
            >
                {title}
            </Clip>
        ))}
    </TimelineContainer>
);

Timeline.propTypes = {
    length: PropTypes.number.isRequired,
    clips: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        url: PropTypes.string,
        duration: PropTypes.number,
        xPosition: PropTypes.number,
        title: PropTypes.string,
    })).isRequired,
    progress: PropTypes.shape({
        played: PropTypes.number, // will be useful for positioning indicator in clip
        playedSeconds: PropTypes.number,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
};
