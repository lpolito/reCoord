import React from 'react';

import { useInterval } from '../../../hooks/use-interval';

const TIME_REFRESH_SECONDS = 1;

interface PlayerProviderProps {
  coord: Coord;
  playbackTime?: number;
  children: React.ReactNode;
}

interface Player {
  id: string | null;
  clip: Clip;
  playerRef: any;
  startTime: number | null;
}

interface PlayerSettersContext {
  setPlaying: (isPlaying: boolean) => void;
  setPlaybackTime: (playbackTime: number) => void;
  addPlayer: (player: Player) => void;
}

interface PlayerActionsContext {
  seekPlayers: (playbackTime: number) => void;
  onSeekHandle: (intent: number) => void;
}

// isPlaying
const IsPlayingContext = React.createContext(false);
export const useIsPlaying = () => React.useContext(IsPlayingContext);

// playbackTime
const PlaybackTimeContext = React.createContext(0);
export const usePlaybackTime = () => React.useContext(PlaybackTimeContext);

// players
const PlayersContext = React.createContext<Player[]>([]);
export const usePlayers = () => React.useContext(PlayersContext);

// setters
const PlayerSettersContext = React.createContext<PlayerSettersContext>({
  setPlaying: () => {},
  setPlaybackTime: () => {},
  addPlayer: () => {},
});
export const usePlayerSetters = () => React.useContext(PlayerSettersContext);

// actions
const PlayerActionsContext = React.createContext<PlayerActionsContext>({
  seekPlayers: () => {},
  onSeekHandle: () => {},
});
export const usePlayerActions = () => React.useContext(PlayerActionsContext);

const calculateStartTime = (
  newPlaybackTime: number,
  clipTimePosition: number
) => {
  const nextStartTime = newPlaybackTime - clipTimePosition;

  return nextStartTime > 1 ? Math.floor(nextStartTime) : null;
};

export const PlayerProvider = ({
  coord,
  playbackTime: initialPlaybackTime = 0,
  children,
}: PlayerProviderProps) => {
  const [isPlaying, setPlaying] = React.useState(false);
  const [playbackTime, setPlaybackTime] = React.useState(initialPlaybackTime);
  const [players, setPlayers] = React.useState<Player[]>([]);

  const addPlayer = React.useCallback(
    (player: Player) => setPlayers(prev => [...prev, player]),
    []
  );

  const updatePlayer = React.useCallback(
    ({ id, clip, startTime }: Player) =>
      setPlayers(prev =>
        prev.map(player => {
          if (id !== player.id) return player;

          // Only allow updating clip and startTime.
          return {
            ...player,
            clip,
            startTime,
          };
        })
      ),
    []
  );

  const seekPlayers = React.useCallback(
    (newPlaybackTime: number) => {
      players.forEach(player => {
        const curClipRelTimePositionA =
          newPlaybackTime - player.clip.timePosition;

        // Seek player if curClipRelTimePosition falls within the current clip.
        if (
          curClipRelTimePositionA < player.clip.duration &&
          curClipRelTimePositionA > 0
        ) {
          player.playerRef.seekTo(curClipRelTimePositionA);
        }
      });
    },
    [players]
  );

  /**
   * @param {number} intent Decimal of current progress bar's length.
   */
  const onSeekHandle = React.useCallback(
    (intent: number) => {
      // Convert intent to playbackTime.
      const newPlaybackTime = intent * coord.length;
      setPlaybackTime(newPlaybackTime);

      if (isPlaying) {
        seekPlayers(newPlaybackTime);
      } else {
        // Update all players' startTimes
        players.forEach(player => {
          updatePlayer({
            ...player,
            startTime: calculateStartTime(
              newPlaybackTime,
              player.clip.timePosition
            ),
          });
        });
      }
    },
    [coord.length, isPlaying, players]
  );

  useInterval(
    () => {
      setPlaybackTime(prevTime => prevTime + TIME_REFRESH_SECONDS);
    },
    isPlaying ? TIME_REFRESH_SECONDS * 1000 : null
  );

  const settersContext: PlayerSettersContext = React.useMemo(
    () => ({
      setPlaying,
      setPlaybackTime,
      addPlayer,
    }),
    []
  );

  const actionsContext: PlayerActionsContext = React.useMemo(
    () => ({
      seekPlayers,
      onSeekHandle,
    }),
    [seekPlayers, onSeekHandle]
  );

  return (
    <IsPlayingContext.Provider value={isPlaying}>
      <PlaybackTimeContext.Provider value={playbackTime}>
        <PlayersContext.Provider value={players}>
          <PlayerSettersContext.Provider value={settersContext}>
            <PlayerActionsContext.Provider value={actionsContext}>
              {children}
            </PlayerActionsContext.Provider>
          </PlayerSettersContext.Provider>
        </PlayersContext.Provider>
      </PlaybackTimeContext.Provider>
    </IsPlayingContext.Provider>
  );
};
