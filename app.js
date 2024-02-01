import express, { json } from 'express'
import { corsMiddleware } from './middleware/cors.js'
import { createMovieRouter } from './routes/movies.js'

export const createApp = ({ movieModel }) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(json())
  app.use(corsMiddleware())

  app.get('/', (req, res) => {
    res.json({ mensaje: 'Hola mundo!' })
  })

  // todos los recursos que sean Movies se identifica con /movies
  app.use('/movies', createMovieRouter({ movieModel }))

  const port = process.env.PORT ?? 1234

  app.listen(port, () => {
    console.log(`server listening on port http://localhost:${port}`)
  })
}
