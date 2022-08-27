import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';

import {
  port,
  clientId,
  clientSecret,
  REDIRECT_URI
} from './config';

const app = express();

app.use(cors());

app.get('/test', (req, res) => {
  console.log('connected to test')
  res.json({ test: 'Hello world!' })
})

app.get('/login', async (req, res) => {
  const { code } = await req.query;
  console.log(`The access code is: ${code}`);

  if (code) {
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    try {
      const tokenResponseData = await axios.post(
        'https://discord.com/api/oauth2/token',
        `client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}&scope=identify&code=${code}`,
        config
      );

      const oauthData = tokenResponseData.data;

      const userResult = await axios({
        method: 'GET',
        url: 'https://discord.com/api/users/@me',
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        }
      });

      const { username, discriminator } = userResult.data;
      console.log(`Hi ${username}${discriminator}`)
      return res.json({ user: `${username}#${discriminator}` });

    } catch (error) {
      console.error(error);
    }
  }


})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
