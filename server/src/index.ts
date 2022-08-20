import express from 'express'
import axios from 'axios'

const app = express()
const { clientId, clientSecret, portDiscord } = require('../tsconfig.json');

const port = process.env.PORT ?? portDiscord

async function getJSONResponse(body: any) {
  let fullBody = '';

  for await (const data of body) {
    fullBody += data.toString();
  }
  return JSON.parse(fullBody);
}


app.get('/test', (req, res) => {
  res.json({ test: 'Hello world!' })
})

app.get('/login', async (req, res) => {
  const { code } = await req.query;
  // const query = JSON.parse(req.query);
  console.log(`The access code is: ${code}`);
  // const { code } = req.query;

  if (code) {
    try {
      const tokenResponseData = await axios({
        method: "post",
        url: "https://discord.com/api/oauth2/token",
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `http://localhost:${port}`,
          scope: 'identify',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const oauthData = await getJSONResponse(tokenResponseData.data);
      console.log(oauthData);
    } catch (error) {
      console.error(error);
    }
  }

  return res.json({ root: '.', req: "test" });
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
