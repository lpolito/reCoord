/**
 * Module dependencies.
 */

import debugLib from 'debug';
import http from 'http';

import app from './app';

const debug = debugLib('server:server');


/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
    const normalizedPort = parseInt(val, 10);

    if (Number.isNaN(normalizedPort)) {
        // named pipe
        return val;
    }

    if (normalizedPort >= 0) {
        // port number
        return normalizedPort;
    }

    return false;
};

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        console.error('Requires elevated privileges');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error('Port is already in use');
        process.exit(1);
        break;
    default:
        throw error;
    }
}

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.log('URL: http://localhost:3001/');
