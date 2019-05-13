import React from 'react';

import {
    BrowserRouter,
    Switch,
    Route,
} from 'react-router-dom';


import {ViewerPage} from './components/viewer/viewer-page';
import {EditorPage} from './components/editor/editor-page';


const routes = [
    {
        component: ViewerPage,
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
