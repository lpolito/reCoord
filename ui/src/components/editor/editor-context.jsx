import React from 'react';
import PropTypes from 'prop-types';

export const EditorContext = React.createContext();

export const EditorProvider = ({coord, children}) => {
    const [editorClips, setEditorClips] = React.useState(coord.clips);

    const updateClip = (index, clip) => {
        setEditorClips((oldClips) => oldClips.map((oldClip, x) => (
            x === index ? clip : oldClip
        )));
    };

    const shiftClip = (id, dir = 'left', distance = 1) => {
        setEditorClips((oldClips) => oldClips.map((oldClip) => {
            if (oldClip.id !== id) return oldClip;

            if (!['left', 'right'].includes(dir)) return oldClip;

            return {
                ...oldClip,
                timePosition: dir === 'left'
                    ? oldClip.timePosition - distance
                    : oldClip.timePosition + distance,
            };
        }));
    };

    const providerValues = {
        coord,
        editorClips,
        updateClip,
        shiftClip,
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
