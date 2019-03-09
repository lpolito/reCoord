import React from 'react';
import ReactDOM from 'react-dom';

import {App} from './app';
import * as serviceWorker from './serviceWorker';

const component = React.createElement(App);
const mountPoint = document.getElementById('root');

ReactDOM.render(component, mountPoint);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
