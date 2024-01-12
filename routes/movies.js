import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'

export const moviesRouter = Router()

// Get all movies
moviesRouter.get('/', MovieController.getAll)
// filter id
moviesRouter.get('/:id', MovieController.getById)

// filter genre
moviesRouter.get('/:genre', MovieController.getByGenre)

// create a new movie
moviesRouter.post('/', MovieController.createMovie)

// update the movie
moviesRouter.patch('/:id', MovieController.updateMovie)

// Delete a movie
moviesRouter.delete('/:id', MovieController.deleteMovie)
