import React from 'react';
import styled from '@emotion/styled';
import {Global} from '@emotion/core';

import ReactPlayer from 'react-player';

import {globalStyles} from './global-styles';

const AppBody = styled.div`
    text-align: center;
`;

const AppContent = styled.header`
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
`;

const VIDEOS = [
    'https://www.youtube.com/watch?v=6Y0WE625Mo4',
    'https://www.youtube.com/watch?v=FJokA_4L5sk',
    'https://www.youtube.com/watch?v=SYO_uzvATJc',
];


export const App = () => {
    const [video, setVideo] = React.useState(VIDEOS[0]);

    return (
        <AppBody>
            <Global styles={globalStyles} />
            <AppContent>
                <ReactPlayer
                    url={video}
                    playing
                    onProgress={(prog) => console.log(prog)}
                />
                <select onChange={(e) => setVideo(e.target.value)}>
                    {VIDEOS.map((v) => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
            </AppContent>
        </AppBody>
    );
};
