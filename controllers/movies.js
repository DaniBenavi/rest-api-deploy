import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
export class MovieController {
  // get all movies
  static async getAll(req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    res.json(movies)
  }

  // get movie by id
  static async getById(req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
  }

  // get movie by genre
  static async getByGenre(req, res) {
    const { genre } = req.params
    const movie = await MovieModel.getByGenre(genre)

    if (movie) return res.json(movie)

    res.status(404).json({ error: 'Movie Not Found' })
  }

  // create a new movie
  static async createMovie(req, res) {
    const result = validateMovie(req.body)

    if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = await MovieModel.createMovie({ input: result.data })

    res.status(201).json(newMovie)
  }

  // update the movie
  static async updateMovie(req, res) {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updatedMovie = await MovieModel.updateMovie({ id, input: result.data })

    return res.json(updatedMovie)
  }

  // delete a movie
  static async deleteMovie(req, res) {
    const { id } = req.params

    const result = await MovieModel.deleteMovie({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.json({ message: 'Movie deleted' })
  }
}
