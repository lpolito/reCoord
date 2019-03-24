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
    padding: 8px 0;
`;

const Clip = styled.div`
    width: ${({width}) => `${width}px`};
    margin: 2px 0;
    transform: ${({clipXPos}) => `translateX(${clipXPos}px)`};

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
        }) => {
            const clipWidth = xFactor(length) * duration;
            const clipXPos = xFactor(length) * xPosition;

            return (
                <Clip
                    key={id}
                    width={clipWidth}
                    clipXPos={clipXPos}
                    onClick={() => onChange(id)}
                >
                    {title}
                    {currentClipId === id && (
                        <ClipIndicator
                            style={{transform: `translateX(${clipWidth * clipProgress}px)`}}
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
        xPosition: PropTypes.number,
        title: PropTypes.string,
    })).isRequired,
    clipProgress: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    currentClipId: PropTypes.number.isRequired,
};