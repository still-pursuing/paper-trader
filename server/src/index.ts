import express from 'express'

const app = express()
const port = process.env.PORT ?? 8080

app.get('/test', (req, res) => {
  res.json({ test: 'Hello world!' })
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
