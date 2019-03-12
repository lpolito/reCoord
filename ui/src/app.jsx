import React from 'react';
import styled from '@emotion/styled';
import {Global} from '@emotion/core';

import ReactPlayer from 'react-player';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {grey} from '@material-ui/core/colors';

import {ThemeProvider} from './theme';

import {globalStyles} from './global-styles';

const calculatePosition = ({length, xPosition}) => (xPosition / length) * 100;

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

const Timeline = styled.div`
    background-color: black;

    display: flex;
    flex-direction: column;

    width: ${({length}) => `${length}px`};
    overflow-y: auto;
    padding: 4px;
`;

const Clip = styled.div`
    width: ${({duration}) => `${duration}px`};
    margin: 2px;
    margin-left: ${((args) => `${calculatePosition(args)}%`)};

    background-color: ${grey[100]};
    color: ${grey[800]};
    padding: 5px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
`;

const VIDEOS = [
    'https://www.youtube.com/watch?v=6Y0WE625Mo4',
    'https://www.youtube.com/watch?v=FJokA_4L5sk',
    'https://www.youtube.com/watch?v=SYO_uzvATJc',
];

const COORD = {
    id: 1,
    name: '',
    length: 500,
    clips: [{
        url: 'https://www.youtube.com/watch?v=6Y0WE625Mo4',
        duration: 194,
        title: '1', // Gorillaz - Superfast Jellyfish (Live in Detroit 2017)',
        thumbnails: {},
        xPosition: 0,
    },
    {
        url: 'https://www.youtube.com/watch?v=FJokA_4L5sk',
        duration: 159,
        title: '2', // 'Gorillaz - \'Superfast Jellyfish\' @ Fox theatre, Detroit 2017',
        thumbnails: {},
        xPosition: 100,
    },
    {
        url: 'https://www.youtube.com/watch?v=SYO_uzvATJc',
        duration: 22,
        title: '3', // 'Gorillaz - Superfast Jellfish live in Detroit',
        thumbnails: {},
        xPosition: 250,
    },
    {
        url: 'https://www.youtube.com/watch?v=6Y0WE625Mo4',
        duration: 50,
        title: '4', // 'Gorillaz - Superfast Jellyfish (Live in Detroit 2017)',
        thumbnails: {},
        xPosition: 50,
    },
    {
        url: 'https://www.youtube.com/watch?v=FJokA_4L5sk',
        duration: 175,
        title: '5', // 'Gorillaz - \'Superfast Jellyfish\' @ Fox theatre, Detroit 2017',
        thumbnails: {},
        xPosition: 300,
    },
    {
        url: 'https://www.youtube.com/watch?v=SYO_uzvATJc',
        duration: 320,
        title: '6', // 'Gorillaz - Superfast Jellfish live in Detroit',
        thumbnails: {},
        xPosition: 400,
    }],
};


export const App = () => {
    const [video, setVideo] = React.useState(VIDEOS[0]);

    const {length, clips} = COORD;

    return (
        <ThemeProvider>
            <AppBody>
                <Global styles={globalStyles} />
                <AppContent>
                    <ReactPlayer
                        url={video}
                        // playing
                        onProgress={(prog) => console.log(prog)}
                    />
                    <Select value={video} onChange={(e) => setVideo(e.target.value)}>
                        {VIDEOS.map((v) => (
                            <MenuItem key={v} value={v}>{v}</MenuItem>
                        ))}
                    </Select>

                    <Timeline length={length}>
                        {clips.map(({duration, xPosition, title}) => (
                            <Clip
                                duration={duration}
                                length={length}
                                xPosition={xPosition}
                            >
                                {title}
                            </Clip>
                        ))}
                    </Timeline>

                </AppContent>
            </AppBody>
        </ThemeProvider>
    );
};
