import express from 'express'
import axios from 'axios'

const app = express()
// const { clientId, clientSecret, portDiscord } = require('../tsconfig.json');

const port = process.env.PORT ?? 8080

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

  console.log(`The access code is: ${code}`);

  return res.json({ root: '.', req: "test" });
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
