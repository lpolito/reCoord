import React from 'react';
import PropTypes from 'prop-types';

export const EditorContext = React.createContext();

const calculateLength = ({clips}) => (
    clips.reduce((acc, clip) => {
        const coordEnd = clip.timePosition + clip.duration;
        // Earliest starting point of coord.
        const end = (acc.end === undefined || coordEnd > acc.end)
            ? coordEnd : acc.end;

        // Latest ending point of coord.
        const start = (acc.start === undefined || clip.timePosition < acc.start)
            ? clip.timePosition : acc.start;

        const length = end - start;
        return {
            start,
            end,
            length,
            startDiff: Math.abs(start),
        };
    }, {
        start: undefined,
        end: undefined,
        length: 0,
        startDiff: 0,
    })
);

const coordReducer = (prevState, {type, payload}) => {
    switch (type) {
    case 'updateClip':
        return {
            ...prevState,
            clips: prevState.clips.map((clip) => {
                const {id, ...rest} = payload;

                if (clip.id !== id) {
                    return clip;
                }

                return {
                    ...clip,
                    ...rest,
                };
            }),
        };

    default:
        return prevState;
    }
};

const useCoordEditor = ({initialCoord}) => {
    const [coord, dispatch] = React.useReducer(coordReducer, initialCoord);

    const updateClip = (clip) => {
        dispatch({
            type: 'updateClip',
            payload: clip,
        });
    };

    return {
        coord,
        updateClip,
    };
};

export const EditorProvider = ({coord: initialCoord, children}) => {
    const {coord, updateClip} = useCoordEditor({initialCoord});

    const providerValues = {
        coord,
        updateClip,
    };

    console.log('length', calculateLength(coord));

    return (
        <EditorContext.Provider value={providerValues}>
            {children}
        </EditorContext.Provider>
    );
};

EditorProvider.propTypes = {
    coord: PropTypes.shape({}).isRequired,
    children: PropTypes.node.isRequired,
};
