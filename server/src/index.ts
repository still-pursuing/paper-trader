import express from 'express';
import axios from 'axios';
import cors from 'cors';
import morgan from 'morgan';

import {
  port,
  clientId,
  clientSecret,
  REDIRECT_URI
} from './config';

import { createToken } from '../helpers/token';
import { authenticateJWT, ensureCorrectUser } from '../middleware/auth';
import { ExpressError, NotFoundError } from './errors';

const app = express();

app.use(cors());
app.use(morgan('tiny'));

app.get('/test', (req, res) => {
  console.log('connected to test')
  res.json({ test: 'Hello world!' })
})

app.get('/login', async (req, res, next) => {
  const { code } = await req.query;
  console.log(`The access code is: ${code}`);

  if (code) {
    let tokenResponseData = undefined;

    try {
      const params = new URLSearchParams();
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);
      params.append('grant_type', 'authorization_code');
      params.append('code', `${code}`);
      params.append('redirect_uri', REDIRECT_URI + 'a');
      params.append('scope', 'identify');

      tokenResponseData = await axios({
        method: 'POST',
        url: 'https://discord.com/api/oauth2/token',
        data: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      });

      const oauthData = tokenResponseData.data;

      const userResult = await axios({
        method: 'GET',
        url: 'https://discord.com/api/users/@me',
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        }
      });

      const { username, discriminator } = userResult.data;

      const token = createToken(`${username}${discriminator}`);
      return res.json({ token });
    } catch (error) {
      error.response.message = error.response.data.error_description;
      next(error.response);
    }
  }
})

app.get('/profile', authenticateJWT, ensureCorrectUser, async (req, res, next) => {
  try {
    // query database for user's data in the future?
    const user = res.locals.user;
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
})

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err: ExpressError, req: express.Request, res: express.Response, next: express.NextFunction) {
  if (process.env.NODE_ENV !== "test") console.error(err);
  const status = err.status || 500;
  const message = err.message;
  return res.status(status).json({
    error: { message, status },
  });
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
