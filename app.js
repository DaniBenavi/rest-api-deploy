import express, { json } from 'express'
import { corsMiddleware } from './middleware/cors.js'
import { moviesRouter } from './routes/movies.js'

// import fs from "node:fs";
// const movies = JSON.parse(fs.readFileSync("./movies.json", "utf8"));
// import movies from "./movies.json" with {type: 'json'};

const app = express()
app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware())

app.get('/', (req, res) => {
  res.json({ mensaje: 'Hola mundo!' })
})

// todos los recursos que sean Movies se identifica con /movies
app.use('movies', moviesRouter)

const port = process.env.PORT ?? 1234

app.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`)
})
