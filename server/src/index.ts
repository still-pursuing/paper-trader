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
import { BadRequestError, ExpressError, NotFoundError } from './errors';

interface DiscordOAuthTokenResponseData {
  token_type: string
  access_token: string
}

interface DiscordUserData {
  username: string
  discriminator: string
}

const app = express();

app.use(cors());
app.use(morgan('tiny'));

app.get('/login', async (req, res, next) => {
  const { code } = req.query;

  if (!code) {
    return next(new BadRequestError());
  }

  let oauthTokenData: DiscordOAuthTokenResponseData;

  try {
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: `${code}`,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI + "a",
      scope: 'identify'
    });

    oauthTokenData = (await axios({
      method: 'POST',
      url: 'https://discord.com/api/oauth2/token',
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    })).data;
  } catch (error) {
    const { data } = error.response.config;
    error.response.config.data =
      `client_id=REDACTED&client_secret=REDACTED&${data.substring(data.indexOf("grant_type"))}`;

    error.response.message = error.response.data.error_description;
    return next(error.response);
  }

  try {
    const userResult: DiscordUserData = (await axios({
      method: 'GET',
      url: 'https://discord.com/api/users/@me',
      headers: {
        authorization: `${oauthTokenData.token_type} ${oauthTokenData.access_token}`,
      }
    })).data;

    const { username, discriminator } = userResult;

    const token = createToken(`${username}${discriminator}`);
    return res.json({ token });
  } catch (error) {

    error.response.config.headers.authorization = "Bearer REDACTED";
    error.response.request._header = "REDACTED";

    error.response.message = error.response.data.message;
    return next(error.response);
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
app.use((req, res, next) => {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use((err: ExpressError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const status = err.status || 500;
  const message = err.status < 500 ? err.message : "Something went wrong";

  console.error(err);

  return res.status(status).json({
    error: { message, status },
  });
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
