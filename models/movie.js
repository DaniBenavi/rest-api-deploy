import { readJSON } from '../utils.js'
import { randomUUID } from 'node:crypto'
const movies = readJSON('../movies.json')

export class MovieModel {
  // Get all movies
  static async getAll({ genre }) {
    if (genre) {
      return movies.filter(m => m.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    }
    return movies
  }

  // Get the movie for id
  static async getById({ id }) {
    const movie = movies.find(movie => movie.id === id)
    return movie
  }

  // get the movie for genre
  static async gatByGenre({ genre }) {
    const movie = movies.find(movie => movie.id === genre)
    return movie
  }

  // create a new movie
  static async create({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input
    }

    movies.push(newMovie)

    return newMovie
  }

  // Delete a movie
  static async delete({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return false
    movies.splice(movieIndex, 1)
    return true
  }

  // update the movie
  static async update({ id, input }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return false
    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input
    }
    return movies[movieIndex]
  }
}
