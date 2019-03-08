import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import routes from './routes.js';


const app = express();

app.use(logger('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use('/', routes);

export default app;
