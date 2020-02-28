import React, { ReactComponentElement, Component } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { red, green } from '@material-ui/core/colors';

import { useEditorContext } from './editor-provider';
import {
  PlayerProvider,
  usePlaybackTime,
  usePlayerActions,
} from '../shared/player/player-provider';

import { Player } from '../shared/player/player';
import { ProgressBar } from '../shared/progressbar';
import { Timeline } from '../shared/timeline';
import { TimelineEditorControls } from './timeline-editor-controls';

import { useLazyInit } from '../../hooks/use-lazy-init';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PlayerSideBySide = styled.div`
  display: flex;
  flex-direction: row;
`;

const TimelineFixedWidth = styled.div`
  width: 640px;
`;

interface EditorTimelineProps {
  editingClips: Clip[];
}

const EditorTimeline = ({ editingClips }: EditorTimelineProps): React.ReactNode => {
  const { coord } = useEditorContext();
  const playbackTime = usePlaybackTime();
  const { seekPlayers } = usePlayerActions();

  const clipIds = React.useMemo(() => editingClips.map(clip => clip.id), [
    coord.clips,
  ]);

  return (
    <TimelineEditorControls
      onChange={(): void => {
        seekPlayers(playbackTime);
      }}
    >
      <Timeline
        length={coord.length}
        clips={coord.clips}
        // clipStyle={({clipId}: {clipId: number}) => css`
        //     background-color: ${clipId === clipA.id ? red[200] : undefined};
        //     background-color: ${clipId === clipB.id ? green[200] : undefined};
        // `}
        playableClipIds={clipIds}
        onChangeClip={(id: number): void => console.log({ id })}
      />
    </TimelineEditorControls>
  );
};

export const Editor = (): React.ReactNode => {
  const { coord } = useEditorContext();

  const [initialClipA, initialClipB] = useLazyInit([
    coord.clips[0],
    coord.clips[1],
  ]);

  // Set initial playbackTime to the latest (in time) clip.
  const initialPlaybackTime = useLazyInit(
    Math.max(initialClipA.timePosition, initialClipB.timePosition)
  );

  const [editingClips, setEditingClips] = React.useState<Clip[]>(
    coord.clips.slice(0, 2)
  );

  return (
    <EditorContainer>
      <PlayerProvider coord={coord} playbackTime={initialPlaybackTime}>
        <PlayerSideBySide>
          {editingClips.map(clip => (
            <Player key={clip.id} clip={clip} startTime={null} />
          ))}
        </PlayerSideBySide>

        <TimelineFixedWidth>
          <ProgressBar length={coord.length} />

          <EditorTimeline editingClips={editingClips} />
        </TimelineFixedWidth>
      </PlayerProvider>
    </EditorContainer>
  );
};
