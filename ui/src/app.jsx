import React from 'react';
import styled from '@emotion/styled';
import {Global} from '@emotion/core';

import {ThemeProvider} from './theme';
import {globalStyles} from './global-styles';

import {Player} from './components/player/player';
import {Timeline} from './components/player/timeline';


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
    length: 500,
    clips: [{
        id: 1,
        url: 'https://www.youtube.com/watch?v=6Y0WE625Mo4',
        duration: 194,
        title: '1', // Gorillaz - Superfast Jellyfish (Live in Detroit 2017)',
        thumbnails: {},
        xPosition: 0,
    },
    {
        id: 2,
        url: 'https://www.youtube.com/watch?v=FJokA_4L5sk',
        duration: 159,
        title: '2', // 'Gorillaz - \'Superfast Jellyfish\' @ Fox theatre, Detroit 2017',
        thumbnails: {},
        xPosition: 100,
    },
    {
        id: 3,
        url: 'https://www.youtube.com/watch?v=SYO_uzvATJc',
        duration: 22,
        title: '3', // 'Gorillaz - Superfast Jellfish live in Detroit',
        thumbnails: {},
        xPosition: 250,
    },
    {
        id: 4,
        url: 'https://www.youtube.com/watch?v=6Y0WE625Mo4',
        duration: 50,
        title: '4', // 'Gorillaz - Superfast Jellyfish (Live in Detroit 2017)',
        thumbnails: {},
        xPosition: 50,
    },
    {
        id: 5,
        url: 'https://www.youtube.com/watch?v=FJokA_4L5sk',
        duration: 175,
        title: '5', // 'Gorillaz - \'Superfast Jellyfish\' @ Fox theatre, Detroit 2017',
        thumbnails: {},
        xPosition: 300,
    },
    {
        id: 6,
        url: 'https://www.youtube.com/watch?v=SYO_uzvATJc',
        duration: 320,
        title: '6', // 'Gorillaz - Superfast Jellfish live in Detroit',
        thumbnails: {},
        xPosition: 400,
    }],
};


export const App = () => {
    const {length, clips} = COORD;

    return (
        <ThemeProvider>
            <AppBody>
                <Global styles={globalStyles} />
                <AppContent>
                    <Player videoUrl={COORD.clips[0].url}>
                        {({progress, onChange}) => (
                            <Timeline
                                length={length}
                                clips={clips}
                                progress={progress}
                                onChange={onChange}
                            />
                        )}
                    </Player>
                </AppContent>
            </AppBody>
        </ThemeProvider>
    );
};
