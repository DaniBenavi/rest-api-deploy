import { Router } from 'express'
import { readJSON } from './utils.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
import { MovieModel } from '../models/movie.js'

const movies = readJSON('./movies.json')

export const moviesRouter = Router()

moviesRouter.get('/', async (req, res) => {
  const { genre } = req.query
  const movies = await MovieModel.getAll({ genre })
  res.json(movies)
})
// filter id
moviesRouter.get('/:id', async (req, res) => {
  // path-to-regexp
  const { id } = req.params
  const movie = await MovieModel.getById(id)

  if (movie) return res.json(movie)

  res.status(404).json({ error: 'Movie Not Found' })
})

// filter genre
moviesRouter.get('/:genre', async (req, res) => {
  const { genre } = req.params
  const movie = await MovieModel.gatByGenre(genre)

  if (movie) return res.json(movie)

  res.status(404).json({ error: 'Movie Not Found' })
})

// create a new movie
moviesRouter.post('/movies', async (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = await MovieModel.create({ input: result.data })

  res.status(201).json(newMovie)
})

// update the movie
moviesRouter.patch('/movies/:id', async (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const updateMovie = await MovieModel.update({ id, input: result.data })

  return res.json(updateMovie)
})

// Delete a movie
moviesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  const result = await MovieModel.delete({ id })

  if (result === false) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  return res.json({ message: 'Movie deleted' })
})
