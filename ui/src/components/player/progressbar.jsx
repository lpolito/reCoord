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

export const ProgressBar = ({length, overallProgress}) => {
    const [active, setActive] = React.useState(false);
    const [intent, setIntent] = React.useState(null);
    const [dragging, setDragging] = React.useState(false);

    const onProgressChange = () => {
        setDragging(false);
        console.table({active, intent, dragging});
    };

    return (
        <ProgressBarContainer>
            <PB
                direction={Direction.HORIZONTAL}
                isEnabled
                onIntent={(pos) => console.log('onIntent') || setIntent(pos)}
                onIntentStart={() => console.log('onIntentStart') || setActive(true)}
                onIntentEnd={() => console.log('onIntentEnd') || setActive(false)}
                onChange={(pos) => console.log('onChange') || (dragging ? setIntent(pos) : null)}
                onChangeStart={() => console.log('onChangeStart') || setDragging(true)}
                onChangeEnd={onProgressChange}
                active={active}
            >
                <Progress style={{transform: `scaleX(${overallProgress / length})`}} />
                {active && <IntentIndicator style={{transform: `scaleX(${intent})`}} />}
            </PB>
        </ProgressBarContainer>
    );
};

ProgressBar.propTypes = {
    length: PropTypes.number.isRequired,
    overallProgress: PropTypes.number,
};

ProgressBar.defaultProps = {
    overallProgress: 0,
};
