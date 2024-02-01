import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'
// import { MovieModel } from '../models/mysql/movie.js'

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router()

  const moviesController = new MovieController({ movieModel })

  // Get all movies
  moviesRouter.get('/', moviesController.getAll)

  // filter id
  moviesRouter.get('/:id', moviesController.getById)

  // filter genre
  moviesRouter.get('/:genre', moviesController.getByGenre)

  // create a new movie
  moviesRouter.post('/', moviesController.createMovie)

  // update the movie
  moviesRouter.patch('/:id', moviesController.updateMovie)

  // Delete a movie
  moviesRouter.delete('/:id', moviesController.deleteMovie)

  return moviesRouter
}
