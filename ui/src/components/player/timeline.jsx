import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import {grey} from '@material-ui/core/colors';


const calculatePosition = ({length, xPosition}) => (xPosition / length) * 100;


const TimelineContainer = styled.div`
    background-color: black;

    display: flex;
    flex-direction: column;

    width: ${({length}) => `${length}px`};
    overflow-y: auto;
    padding: 4px;
`;

const Clip = styled.div`
    width: ${({duration}) => `${duration}px`};
    margin: 2px;
    margin-left: ${((args) => `${calculatePosition(args)}%`)};

    background-color: ${grey[100]};
    color: ${grey[800]};
    padding: 5px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const Timeline = ({
    length, clips, progress, onChange,
}) => console.log(progress) || (
    <TimelineContainer length={length}>
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
        playedSeconds: PropTypes.number,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
};
