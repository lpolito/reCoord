import React from 'react';

import {
    BrowserRouter,
    Switch,
    Route,
} from 'react-router-dom';


import {PlayerPage} from './pages/player-page';


const routes = [{
    component: PlayerPage,
    path: '/',
    exact: true,
}];


export const RoutedContent = () => (
    <BrowserRouter>
        <Switch>
            {routes.map((route) => <Route {...route} key={route.path} />)}
        </Switch>
    </BrowserRouter>
);
