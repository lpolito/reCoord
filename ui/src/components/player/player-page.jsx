import React from 'react';

import {TimelineProvider} from '../timeline-context';

import {Player} from './player';


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
        timePosition: 0,
    },
    {
        id: 2,
        url: 'https://www.youtube.com/watch?v=FJokA_4L5sk',
        duration: 159,
        title: 'Gorillaz - \'Superfast Jellyfish\' @ Fox theatre, Detroit 2017',
        thumbnails: {},
        timePosition: 32,
    },
    {
        id: 3,
        url: 'https://www.youtube.com/watch?v=SYO_uzvATJc',
        duration: 22,
        title: 'Gorillaz - Superfast Jellfish live in Detroit',
        thumbnails: {},
        timePosition: 24,
    }],
};

export const PlayerPage = () => (
    <TimelineProvider>
        <Player coord={COORD} />
    </TimelineProvider>
);
