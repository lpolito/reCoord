import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

import {grey} from '@material-ui/core/colors';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';

import {EditorContext} from './editor-context';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 -20px 0 -20px;
`;

const ControlContainer = styled.div`
    height: 100%;
    width: 20px;
    z-index: 2;
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
    const {editorClips, shiftClip} = React.useContext(EditorContext);

    return (
        <Container>
            <ControlContainer>
                {editorClips.map(({id}) => (
                    <Left
                        key={id}
                        onClick={() => shiftClip(id, 'left')}
                    />
                ))}
            </ControlContainer>

            {children}

            <ControlContainer>
                {editorClips.map(({id}) => (
                    <Right
                        key={id}
                        onClick={() => shiftClip(id, 'right')}
                    />
                ))}
            </ControlContainer>
        </Container>
    );
};

TimelineEditor.propTypes = {
    children: PropTypes.node.isRequired,
};
