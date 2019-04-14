import React from 'react';
import PropTypes from 'prop-types';

export const EditorContext = React.createContext();

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
