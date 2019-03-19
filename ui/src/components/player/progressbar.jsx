import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import {Slider, Direction} from 'react-player-controls';

const PB = styled(Slider)`
    width: 100%;
    height: ${({active}) => (active ? '15px' : '5px')};
    background-color: grey;
`;

const Progress = styled.div`
    height: 100%;
    background-color: red;
`;

export const ProgressBar = ({length, overallProgress}) => {
    const [active, setActive] = React.useState(false);

    return (
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
            <Progress style={{width: `${overallProgress / length * 100}%`}} />
        </PB>
    );
};

ProgressBar.propTypes = {
    length: PropTypes.number.isRequired,
    overallProgress: PropTypes.number,
};

ProgressBar.defaultProps = {
    overallProgress: 0,
};
