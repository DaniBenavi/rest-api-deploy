// import { MovieModel } from '../models/local-file-system/movie.js'
// import { MovieModel } from '../models/mysql/movie.js'
// import { MovieModel } from '../models/database/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
export class MovieController {
  constructor({ movieModel }) {
    this.movieModel = movieModel
  }

  // get all movies
  getAll = async (req, res) => {
    const { genre } = req.query
    const movies = await this.movieModel.getAll({ genre })
    res.json(movies)
  }

  // get movie by id
  getById = async (req, res) => {
    const { id } = req.params
    const movie = await this.movieModel.getById({ id })
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
  }

  // get movie by genre
  getByGenre = async (req, res) => {
    const { genre } = req.query
    const movies = await this.movieModel.getByGenre({ genre })

    if (movies) {
      return res.json(movies)
    }

    res.status(404).json({ error: 'Movies Not Found' })
  }

  // create a new movie
  createMovie = async (req, res) => {
    const result = validateMovie(req.body)

    if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = await this.movieModel.createMovie({ input: result.data })

    res.status(201).json(newMovie)
  }

  // update the movie
  updateMovie = async (req, res) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updatedMovie = await this.movieModel.updateMovie({ id, input: result.data })

    return res.json(updatedMovie)
  }

  // delete a movie
  deleteMovie = async (req, res) => {
    const { id } = req.params

    const result = await this.movieModel.deleteMovie({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.json({ message: 'Movie deleted' })
  }
}
