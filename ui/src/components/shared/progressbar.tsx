import React from 'react';
import styled from '@emotion/styled';

import { Slider, Direction } from 'react-player-controls';

import { usePlaybackTime, usePlayerActions } from './player/player-provider';

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
`;

const PB = styled(Slider)`
  width: 100%;
  height: 100%;
  ${({ active }) => (active ? '' : 'transform: scaleY(0.6)')};
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

interface ProgressBarProps {
  length: number;
}

export const ProgressBar = ({ length }: ProgressBarProps) => {
  const { onSeekHandle } = usePlayerActions();
  const playbackTime = usePlaybackTime();

  const [active, setActive] = React.useState(false);
  // intent is decimal of current progress bar's length
  const [intent, setIntent] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);

  const changeTimePosition = () => {
    setDragging(false);
    onSeekHandle(intent);
  };

  const progressScale = playbackTime / length;

  return (
    <ProgressBarContainer>
      <PB
        direction={Direction.HORIZONTAL}
        isEnabled
        onIntent={(pos: number) => setIntent(pos)}
        onIntentStart={() => setActive(true)}
        onIntentEnd={() => setActive(false)}
        onChange={(pos: number) => (dragging ? setIntent(pos) : null)}
        onChangeStart={() => setDragging(true)}
        onChangeEnd={changeTimePosition}
        active={active}
      >
        <Progress
          style={{
            transform: `scaleX(${progressScale >= 1 ? 1 : progressScale})`,
          }}
        />
        {active && (
          <IntentIndicator style={{ transform: `scaleX(${intent})` }} />
        )}
      </PB>
    </ProgressBarContainer>
  );
};
