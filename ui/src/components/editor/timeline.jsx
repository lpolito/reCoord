import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

import {grey, red} from '@material-ui/core/colors';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';

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
    height: 25px;
    margin: 2px 0;
    transform: ${({clipXPos}) => `translateX(${clipXPos}px)`};

    position: relative;
    background-color: ${({isPlaying}) => (isPlaying ? red[100] : grey[500])};
    color: ${grey[800]};
    border-radius: 4px;
`;

const ClipIndicator = styled.div`
    width: 2px;
    height: 100%;
    position: absolute;
    top: 0;
    background-color: red;
`;

const ClipContents = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    > span {
        font-size: 12px;
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const AlignControlBase = css`
    height: 100%;
    z-index: 2;
`;

const Left = styled(ArrowLeft)`
    ${AlignControlBase}
`;

const Right = styled(ArrowRight)`
    ${AlignControlBase}
`;


export const Timeline = ({
    length, clips, overallTime, selectedClips,
}) => (
    <TimelineContainer>
        {clips.map(({
            id, duration, timePosition, title,
        }) => {
            const clipWidth = xFactor(length) * duration;
            const clipXPos = xFactor(length) * timePosition;

            const isPlaying = selectedClips.includes(id);

            const currentClipProgress = isPlaying
                ? (overallTime - timePosition) / duration
                : 0;

            return (
                <Clip
                    key={id}
                    width={clipWidth}
                    clipXPos={clipXPos}
                    isPlaying={isPlaying}
                >
                    {isPlaying && (
                        <>
                            <ClipContents>
                                <Left color='action' />

                                <span>{title}</span>

                                <Right />
                            </ClipContents>

                            <ClipIndicator
                                style={{transform: `translateX(${clipWidth * currentClipProgress}px)`}}
                            />
                        </>
                    )}

                    {!isPlaying && (
                        <ClipContents>
                            <span>{title}</span>
                        </ClipContents>
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
    selectedClips: PropTypes.arrayOf(PropTypes.number).isRequired,
};
