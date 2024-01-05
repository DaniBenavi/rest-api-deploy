const express = require("express");
const crypto = require("node:crypto");
const movies = require("./movies.json");
const cors = require("cors");
const { validateMovie, validatePartialMovie } = require("./schemas/movies");
const { validateHeaderName } = require("node:http");
const { access } = require("node:fs");

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://localhost:8080",
        "http://localhost:1234",
        "http://movies.com",
        "http://dani.dev",
      ];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.get("/", (req, res) => {
  res.json({ mensaje: "Hola mundo!" });
});

//todos los recursos que sean Movies se identifica con /movies
app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter(m => m.genre.some(g => g.toLowerCase() === genre.toLowerCase()));

    return res.json(filteredMovies);
  }
  res.json(movies);
});

//filtrar por id
app.get("/movies/:id", (req, res) => {
  //path-to-regexp
  const { id } = req.params;
  const movie = movies.find(m => m.id === id);
  if (movie) return res.json(movie);

  res.status(404).json({ error: "Movie Not Found" });
});

//filter genre
app.get("/movies/:genre", (req, res) => {
  const { genre } = req.params;
  const movie = movies.find(m => m.id === genre);

  if (movie) return res.json(movie);

  res.status(404).json({ error: "Movie Not Found" });
});

//create a new movie

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
});

//update movie

app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex(m => m.id === id);
  if (movieIndex < 0) return res.status(404).json({ message: "Movie not found " });

  const updateMovie = { ...movies[movieIndex], ...result.data };

  movies[movieIndex] = updateMovie;

  return res.json(updateMovie);
});

//Delete a movie

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex(movie => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movies.splice(movieIndex, 1);

  return res.json({ message: "Movie deleted" });
});

app.options("/movies/:id", (req, res) => {
  const origin = req.header("Origin");
  if (Accepted_Origins.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  }
  res.send(200);
});

const port = process.env.PORT ?? 1234;

app.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`);
});
