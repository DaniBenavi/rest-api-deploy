import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'moviesdb',
  password: '1907',
  port: 5434
})

export class MovieModel {
  static async getAll({ genre }) {
    const client = await pool.connect()
    try {
      const { rows } = await client.query(`
        SELECT * from movie_details_view
      `)
      return rows
    } finally {
      client.release()
    }
  }

  static async getById({ id }) {
    const client = await pool.connect()
    try {
      const { rows } = await client.query(
        `
        SELECT m.id as Id, m.title, m.year, m.director, m.duration, m.poster, m.rate, g.name AS Genre
        FROM movie m
        JOIN movie_genres mg ON m.id = mg.movie_id
        JOIN genre g ON mg.genre_id = g.id
        WHERE m.id = $1
      `,
        [id]
      )
      return rows.length ? rows[0] : null
    } finally {
      client.release()
    }
  }

  static async getByGenre({ genre }) {
    const client = await pool.connect()
    try {
      const { rows } = await client.query(
        `
        SELECT m.id AS Id, m.title, m.year, m.director, m.duration, m.poster, m.rate, g.name AS Genre
        FROM movie m
        JOIN movie_genres mg ON m.id = mg.movie_id
        JOIN genre g ON mg.genre_id = g.id
        WHERE g.name = $1
      `,
        [genre]
      )
      return rows
    } finally {
      client.release()
    }
  }

  static async createMovie({ input }) {
    const {
      title,
      year,
      director,
      duration,
      rate,
      poster,
      genre: genreInput // genre is an array, pero no se usa en la consulta
    } = input

    const client = await pool.connect()
    try {
      const { rows } = await client.query(
        `
        INSERT INTO movie (id, title, year, director, duration, poster, rate)
        VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6)
        RETURNING id, title, year, director, duration, poster, rate
      `,
        [title, year, director, duration, poster, rate]
      )
      return rows[0]
    } finally {
      client.release()
    }
  }

  static async delete({ id }) {
    const client = await pool.connect()
    try {
      const { rows } = await client.query('DELETE FROM movie WHERE id = $1 RETURNING *', [id])
      return rows.length ? rows[0] : null
    } finally {
      client.release()
    }
  }

  static async update({ id, input }) {
    // Implementa la lógica de actualización aquí
  }
}
