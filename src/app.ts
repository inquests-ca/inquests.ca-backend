import express from 'express';
import createError from 'http-errors';
import morgan from 'morgan';

import authoritiesRouter from './routes/authorities';
import inquestsRouter from './routes/inquests';
import jurisdictionsRouter from './routes/jurisdictions';
import keywordsRouter from './routes/keywords';
import deathCausesRouter from './routes/deathCauses';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000'];
  const origin = Array.isArray(req.headers.origin) ? req.headers.origin[0] : req.headers.origin;
  if (origin && allowedOrigins.indexOf(origin) > -1) res.set('Access-Control-Allow-Origin', origin);
  next();
});

app.use('/authorities', authoritiesRouter);
app.use('/inquests', inquestsRouter);
app.use('/jurisdictions', jurisdictionsRouter);
app.use('/keywords', keywordsRouter);
app.use('/deathCauses', deathCausesRouter);

// Catch 404 and forward to error handler.
app.use((_req, _res, next) => {
  next(createError(404));
});

// Error handler
// TODO: catch Promise rejections.
app.use(
  (
    err: { status: number; message: string },
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction
  ) => {
    console.error(err.message);
    res.sendStatus(err.status || 500);
  }
);

export default app;
