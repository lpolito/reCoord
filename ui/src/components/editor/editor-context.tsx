import React from 'react';

interface EditorContextValue {
    coord: Coord;
    updateCoord: (coord: Coord) => void;
    updateClip: (clip: Clip) => void;
}

const EditorContext = React.createContext<EditorContextValue>({
    coord: {} as Coord,
    updateCoord: () => {},
    updateClip: () => {},
});

interface TimelineInfo {
    start?: number;
    end?: number;
    length: number;
}

const calcTimelineInfo = (clips: Clip[]) => (
    clips.reduce((acc: TimelineInfo, clip: Clip): TimelineInfo => {
        const coordEnd = clip.timePosition + clip.duration;
        // Earliest starting point of coord.
        const end = (acc.end === undefined || coordEnd > acc.end)
            ? coordEnd
            : acc.end;

        // Latest ending point of coord.
        const start = (acc.start === undefined || clip.timePosition < acc.start)
            ? clip.timePosition
            : acc.start;

        return {
            start,
            end,
            length: end! - start!,
        };
    }, {
        start: undefined,
        end: undefined,
        length: 0,
    })
);

interface CoordReducerDispatchArgs {
    type: 'updateCoord' | 'updateClip';
    payload: {
        id: number;
    };
}

const coordReducer = (
    prevCoord: Coord,
    {type, payload}: CoordReducerDispatchArgs
): Coord => {
    switch (type) {
    case 'updateCoord':
        return {
            ...prevCoord,
            ...payload,
        };
    case 'updateClip': {
        const clips = prevCoord.clips.map((clip): Clip => {
            const {id, ...rest} = payload;

            if (clip.id !== id) {
                return clip;
            }

            return {
                ...clip,
                ...rest,
            };
        });

        const {start = 0, length} = calcTimelineInfo(clips);

        // Shift clips so the earliest clip is always at timePosition: 0.
        const shiftedClips = clips.map((clip): Clip => ({
            ...clip,
            timePosition: clip.timePosition - start,
        }));

        return {
            ...prevCoord,
            clips: shiftedClips,
            length,
        };
    }
    default:
        return prevCoord;
    }
};


const useCoordEditor = (initialCoord: Coord) => {
    const [coord, dispatch] = React.useReducer(coordReducer, initialCoord);

    const updateCoord = (newCoord: Coord) => {
        dispatch({
            type: 'updateCoord',
            payload: newCoord,
        });
    };

    const updateClip = (clip: Clip) => {
        dispatch({
            type: 'updateClip',
            payload: clip,
        });
    };

    return {
        coord,
        updateCoord,
        updateClip,
    };
};


interface EditorProviderProps {
    coord: Coord;
    children: React.ReactNode;
}

export const EditorProvider = ({
    coord: initialCoord,
    children,
}: EditorProviderProps) => {
    const {
        coord,
        updateCoord,
        updateClip,
    } = useCoordEditor(initialCoord);

    // useMemo around Provider context as good practice.
    const context = React.useMemo(() => ({
        coord,
        updateCoord,
        updateClip,
    }), [
        coord,
        updateCoord,
        updateClip,
    ]);

    return (
        <EditorContext.Provider value={context}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditorContext = () => React.useContext(EditorContext);
