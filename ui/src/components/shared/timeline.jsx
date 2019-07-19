import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import {grey} from '@material-ui/core/colors';

import {usePlaybackTime} from './time-context';


// factor by which widths & positions of clips needs to be multiplied by to fit in timeline width
// x = width of timeline / length of coord
// pixels over time
const xFactor = (coordLength) => 640 / coordLength;

// width = width of player
const TimelineContainer = styled.div`
    background-color: black;

    display: flex;
    flex-direction: column;

    width: 640px;
    padding: 8px 0;
`;

const Clip = styled.div`
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

export const Timeline = ({
    length, clips, playableClipIds, currentClipId, onChangeClip, clipStyle,
}) => {
    const [playbackTime] = usePlaybackTime();

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
                        id={id}
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
}

Timeline.propTypes = {
    length: PropTypes.number.isRequired,
    clips: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        duration: PropTypes.number,
        timePosition: PropTypes.number,
        title: PropTypes.string,
    })).isRequired,
    playableClipIds: PropTypes.arrayOf(PropTypes.number),
    currentClipId: PropTypes.number,
    onChangeClip: PropTypes.func,
    clipStyle: PropTypes.instanceOf(Object),
};

Timeline.defaultProps = {
    playableClipIds: [],
    currentClipId: undefined,
    onChangeClip: () => {},
    clipStyle: {},
};
