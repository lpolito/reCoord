import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

import {grey} from '@material-ui/core/colors';
import {ArrowLeft, ArrowRight} from '@material-ui/icons';

import {EditorContext} from './editor-context';

const Container = styled.div`
    display: flex;
    margin: 0 -20px 0 -20px;
`;

const ControlContainer = styled.div`
    height: 100%;
    width: 20px;
    padding: 8px 0;
`;

const ControlBase = css`
    height: 15px;
    margin: 2px 0;
    color: ${grey[100]};
`;

const Left = styled(ArrowLeft)`
    ${ControlBase}
`;

const Right = styled(ArrowRight)`
    ${ControlBase}
`;


export const TimelineEditor = ({
    children,
}) => {
    const {coord, updateClip} = React.useContext(EditorContext);

    const shiftClip = ({clip, dir, distance = 1}) => {
        if (!['left', 'right'].includes(dir)) return;

        updateClip({
            ...clip,
            timePosition: dir === 'left'
                ? clip.timePosition - distance
                : clip.timePosition + distance,
        });
    };

    return (
        <Container>
            <ControlContainer>
                {coord.clips.map((clip) => (
                    <Left
                        key={clip.id}
                        onClick={() => shiftClip({clip, dir: 'left'})}
                    />
                ))}
            </ControlContainer>

            {children}

            <ControlContainer>
                {coord.clips.map((clip) => (
                    <Right
                        key={clip.id}
                        onClick={() => shiftClip({clip, dir: 'right'})}
                    />
                ))}
            </ControlContainer>
        </Container>
    );
};

TimelineEditor.propTypes = {
    children: PropTypes.node.isRequired,
};
