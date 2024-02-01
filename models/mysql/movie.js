import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: '',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll({ genre }) {
    const [movies] = await connection.query(
      'SELECT m.id as Id, m.title AS title,m.year AS year,m.director AS director, m.duration AS duration,m.poster AS poster, m.rate AS rate,g.name AS Genre FROM movie m JOIN movie_genres mg ON m.id = mg.movie_id JOIN genre g ON mg.genre_id = g.id'
    )

    return movies
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      'SELECT m.id as Id, m.title AS title,m.year AS year,m.director AS director, m.duration AS duration,m.poster AS poster, m.rate AS rate,g.name AS Genre FROM movie m JOIN movie_genres mg ON m.id = mg.movie_id JOIN genre g ON mg.genre_id = g.id WHERE m.id=?',
      id
    )

    if (movies.length === 0) return null

    return movies[0]
  }

  static async getByGenre({ genre }) {
    const [movies] = await connection.query(
      'SELECT m.id AS Id, m.title AS title, m.year AS year, m.director AS director, m.duration AS duration, m.poster AS poster, m.rate AS rate, g.name AS Genre FROM movie m JOIN movie_genres mg ON m.id = mg.movie_id JOIN genre g ON mg.genre_id = g.id WHERE g.name=?;',
      genre
    )

    if (movies.length === 0) return null

    return movies
  }

  static async createMovie({ input }) {
    const {
      genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    // todo: crear la conexión de genre

    // crypto.randomUUID()
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    console.log(uuid)
    try {
      await connection.query(
        `insert into movie (id,title, year, director, duration, poster, rate) values
        (?, ?, ?, ?, ?, ?, ?);`,
        [uuid, title, year, director, duration, poster, rate]
      )
    } catch (e) {
      // puede enviarle información sensible
      throw new Error('Error creating movie')
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    const [movies] = await connection.query(
      'SELECT id,title, year, director, duration, poster, rate from movie where id= ?;',
      uuid
    )

    return movies[0]
  }

  static async delete({ id }) {
    const [movies] = await connection.query('Delete * from movie where id=?', id)

    if (movies.length === 0) return null

    return movies[0]
  }

  static async update({ id, input }) {}
}
