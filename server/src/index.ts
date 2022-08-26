import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// dotenv.config();

app.use(cors());
// const { clientId, clientSecret, portDiscord } = require('../tsconfig.json');

const port = process.env.PORT ?? 8080;
const REDIRECT_URI = process.env.NODE_ENV === "production"
  ? "https://paper-trader-182a4.web.app/login/discord-redirect"
  : "http://localhost:3000/login/discord-redirect";

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
        `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}&scope=identify&code=${code}`,
        config
      );

      const oauthData = tokenResponseData.data;
      // console.log(oauthData);

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
