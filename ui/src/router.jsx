import React from 'react';

import {
    BrowserRouter,
    Switch,
    Route,
} from 'react-router-dom';


import {PlayerPage} from './components/player/player-page';
import {EditorPage} from './components/editor/editor-page';


const routes = [
    {
        component: PlayerPage,
        path: '/',
        exact: true,
    },
    {
        component: EditorPage,
        path: '/editor',
        exact: true,
    },
];


export const RoutedContent = () => (
    <BrowserRouter>
        <Switch>
            {routes.map((route) => <Route {...route} key={route.path} />)}
        </Switch>
    </BrowserRouter>
);
