import React from 'react';
import styled from '@emotion/styled';
import {Global} from '@emotion/core';

import {ThemeProvider} from './theme';
import {globalStyles} from './global-styles';

import {Player} from './components/player/player';


const AppBody = styled.div`
    text-align: center;
`;

const AppContent = styled.div`
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const COORD = {
    id: 1,
    name: '',
    length: 194,
    clips: [{
        id: 1,
        url: 'https://www.youtube.com/watch?v=6Y0WE625Mo4',
        duration: 194,
        title: 'Gorillaz - Superfast Jellyfish (Live in Detroit 2017)',
        thumbnails: {},
        xPosition: 0,
    },
    {
        id: 2,
        url: 'https://www.youtube.com/watch?v=FJokA_4L5sk',
        duration: 159,
        title: 'Gorillaz - \'Superfast Jellyfish\' @ Fox theatre, Detroit 2017',
        thumbnails: {},
        xPosition: 32,
    },
    {
        id: 3,
        url: 'https://www.youtube.com/watch?v=SYO_uzvATJc',
        duration: 22,
        title: 'Gorillaz - Superfast Jellfish live in Detroit',
        thumbnails: {},
        xPosition: 24,
    }],
};


export const App = () => (
    <ThemeProvider>
        <AppBody>
            <Global styles={globalStyles} />
            <AppContent>
                <Player coord={COORD} />
            </AppContent>
        </AppBody>
    </ThemeProvider>
);
