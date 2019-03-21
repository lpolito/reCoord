import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import {Slider, Direction} from 'react-player-controls';

const ProgressBarContainer = styled.div`
    width: 100%;
    height: 12px;
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
    background-color: red;
    transform-origin: 0 0;
`;

export const ProgressBar = ({length, overallProgress}) => {
    const [active, setActive] = React.useState(false);

    return (
        <ProgressBarContainer>
            <PB
                direction={Direction.HORIZONTAL}
                isEnabled
                onIntent={(intent) => console.log(`hovered at ${intent}`)}
                onIntentStart={(intent) => console.log(`entered with mouse at ${intent}`) || setActive(true)}
                onIntentEnd={() => console.log('left with mouse') || setActive(false)}
                onChange={(newValue) => console.log(`clicked at ${newValue}`)}
                onChangeStart={(startValue) => console.log(`started dragging at ${startValue}`)}
                onChangeEnd={(endValue) => console.log(`stopped dragging at ${endValue}`)}

                active={active}
            >
                <Progress style={{transform: `scaleX(${overallProgress / length})`}} />
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
