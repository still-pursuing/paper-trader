import { Router } from 'express'

import { Discord } from '../api/discord';
import { createToken } from '../helpers/token';
import { BadRequestError, ExpressError } from '../errors';
import { User } from '../models/user';

export const router = Router();

/** GET / => { token }
 *
 * Returns JWT token which can be used to authenticate further requests
 * or an error if requests to Discord OAuth API fail
 *
 * Authorization required: none
 */

router.get('/', async (req, res, next) => {
  const { code } = req.query;

  if (!code) return next(new BadRequestError());

  let oauthTokenData;

  try {
    oauthTokenData = await Discord.getDiscordToken(code.toString());
  } catch (error) {
    const { data } = error.response.config;
    error.response.config.data =
      `client_id=REDACTED&client_secret=REDACTED&${data.substring(data.indexOf("grant_type"))}`;

    error.response.message = error.response.data.error_description;
    return next(error.response);
  }

  let userResult;

  try {
    userResult = await Discord.getDiscordUser(oauthTokenData.token_type, oauthTokenData.access_token);
  } catch (error) {

    error.response.config.headers.authorization = "Bearer REDACTED";
    error.response.request._header = "REDACTED";

    error.response.message = error.response.data.message;
    return next(error.response);
  }

  try {
    const { id, username, discriminator } = userResult;
    const user = await User.loginOrRegister(id, `${username}#${discriminator}`);

    const token = createToken(user);
    return res.json({ token });
  } catch (error) {
    return next(error);
  }

})