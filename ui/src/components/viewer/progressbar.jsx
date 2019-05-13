import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import {Slider, Direction} from 'react-player-controls';

const ProgressBarContainer = styled.div`
    width: 100%;
    height: 10px;
`;

const PB = styled(Slider)`
    width: 100%;
    height: 100%;
    ${({active}) => (active ? '' : 'transform: scaleY(0.6)')};
    background-color: grey;
`;

const Progress = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    transform-origin: 0 0;
    z-index: 5;
    background-color: red;
`;

const IntentIndicator = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    transform-origin: 0 0;
    z-index: 4;
    background-color: white;
    opacity: 0.6;
`;

export const ProgressBar = ({length, playbackTime, onSeek}) => {
    const [active, setActive] = React.useState(false);
    // intent is decimal of current progress bar's length
    const [intent, setIntent] = React.useState(null);
    const [dragging, setDragging] = React.useState(false);

    const changeTimePosition = () => {
        setDragging(false);
        onSeek(intent);
    };

    return (
        <ProgressBarContainer>
            <PB
                direction={Direction.HORIZONTAL}
                isEnabled
                onIntent={(pos) => setIntent(pos)}
                onIntentStart={() => setActive(true)}
                onIntentEnd={() => setActive(false)}
                onChange={(pos) => (dragging ? setIntent(pos) : null)}
                onChangeStart={() => setDragging(true)}
                onChangeEnd={changeTimePosition}
                active={active}
            >
                <Progress style={{transform: `scaleX(${playbackTime / length})`}} />
                {active && <IntentIndicator style={{transform: `scaleX(${intent})`}} />}
            </PB>
        </ProgressBarContainer>
    );
};

ProgressBar.propTypes = {
    length: PropTypes.number.isRequired,
    playbackTime: PropTypes.number,
    onSeek: PropTypes.func.isRequired,
};

ProgressBar.defaultProps = {
    playbackTime: 0,
};
