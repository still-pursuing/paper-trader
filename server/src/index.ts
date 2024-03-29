import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { port } from './config';

import { ExpressError, NotFoundError } from './errors';
import { router as homeRoute } from './routes/home';
import { router as loginRoute } from './routes/login';
import { router as userRoute } from './routes/user';
import { router as stockRoute } from './routes/stock';
import { authenticateJWT } from './middleware/auth';
import { validateTicker } from './middleware/validateTicker';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.use('/', homeRoute);
app.use('/login', loginRoute);

app.use(authenticateJWT);
app.use('/user', userRoute);
app.use('/stock', validateTicker, stockRoute);

/** Handle 404 errors -- this matches everything */
app.use((req, res, next) => {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(
  (
    err: ExpressError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const status = err.status || 500;
    const message = err.status < 500 ? err.message : 'Something went wrong';

    console.error(err);

    return res.status(status).json({
      error: { message, status },
    });
  }
);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
