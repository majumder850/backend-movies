const express = require("express");
const app = express();
const { initializeDatabase } = require("./db/db.connect");
const Movie = require("./models/movie.models");

app.use(express.json());

initializeDatabase();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// const newMovie = {
//   title: "New Movie",
//   releaseYear: 2023,
//   genre: ["Drama"],
//   director: "Aditya Roy Chopra",
//   actors: ["Actor1", "Actor2"],
//   language: "Hindi",
//   country: "India",
//   rating: 6.1,
//   plot: "A young man and woman fall in love on a Australia trip.",
//   awards: "IFA Filmfare Awards",
//   posterUrl: "https://example.com/new-poster1.jpg",
//   trailerUrl: "https://example.com/new-trailer1.mp4",
// };

async function createMovie(newMovie) {
  try {
    const movie = new Movie(newMovie);
    const saveMovie = await movie.save();
    return saveMovie;
  } catch (error) {
    throw error;
  }
}
// createMovie(newMovie);

app.post("/movies", async (req, res) => {
  try {
    const savedMovie = await createMovie(req.body);
    res
      .status(201)
      .json({ message: "Movie added successfully.", movie: savedMovie });
  } catch (error) {
    res.status(500).json({ error: "Failed to add movie" });
  }
});

// get movie by director name (To find 1 director)

// async function readMovieByDirector(directorName) {
//   try {
//     const movieByDirector = await Movie.findOne({ director: directorName });
//     return movieByDirector;
//   } catch (error) {
//     console.log(error);
//   }
// }

// get movie by director name (If there is multiple data by same director name)

async function readMovieByDirector(directorName) {
  try {
    const movieByDirector = await Movie.find({ director: directorName });
    return movieByDirector;
  } catch (error) {
    console.log(error);
  }
}
``;
// readMovieByDirector("Kabir Khan");

app.get("/movies/director/:directorName", async (req, res) => {
  try {
    const movies = await readMovieByDirector(req.params.directorName);
    if (movies.length != 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "No movies found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

// find a movie with a particular title

async function readMovieByTitle(movieTitle) {
  try {
    const movie = await Movie.findOne({ title: movieTitle });
    return movie;
  } catch (error) {
    throw error;
  }
}

app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await readMovieByTitle(req.params.title);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie." });
  }
});

// find a movie with genre

async function readMovieByGenre(genreName) {
  try {
    const movieByGenre = await Movie.find({ genre: genreName });
    return movieByGenre;
  } catch (error) {
    console.log(error);
  }
}

app.get("/movies/genres/:genreName", async (req, res) => {
  try {
    const movies = await readMovieByGenre(req.params.genreName);
    if (movies.length != 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "No movies found." });
    }
  } catch {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

// to get all the movies in the database

async function readAllMovies() {
  try {
    const allMovies = await Movie.find();
    return allMovies;
  } catch (error) {
    console.log(error);
  }
}

app.get("/movies", async (req, res) => {
  try {
    const movies = await readAllMovies();
    if (movies.length != 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "No movies found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

// find movie by id and update it's rating

// async function updateMovie(movieId, dataToUpdate) {
//   try {
//     const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, {
//       new: true,
//     });
//     console.log(updatedMovie);
//   } catch (error) {
//     console.log("Error in updating Movie rating", error);
//   }
// }
// updateMovie("69ad73d02af1a44fa6e1bc82", { releaseYear: 2002 });

// find one data and update its value

async function updateMovieDetail(movieTitle, dataToUpdate) {
  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { title: movieTitle },
      dataToUpdate,
      { new: true },
    );
    console.log(updatedMovie);
  } catch (error) {
    console.log("Error in changing data:", error);
  }
}
// updateMovieDetail("Kabhi Khushi Kabhie Gham", { releaseYear: 2001 });

// find a movie by id and delete from the database

// async function deleteMovie(movieId) {
//   try {
//     const deleteMovie = await Movie.findByIdAndDelete(movieId);
//   } catch (error) {
//     console.log("Error in Deleting Movie", error);
//   }
// }

// deleteMovie("69b0fa7287571308855a7a2c");

// find a movie by title and delete from the database

async function deleteMovieFromDb(movieTitle) {
  try {
    const deletedMovie = await Movie.findOneAndDelete({ title: movieTitle });
    console.log("This movie was deleted:", deletedMovie);
  } catch (error) {
    console.log("Error in movie deletion", error);
  }
}

// deleteMovieFromDb("3 Idiots");

async function deleteMovie(movieId) {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(movieId);
    return deletedMovie;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/movies/:movieId", async (req, res) => {
  try {
    const deletedMovie = await deleteMovie(req.params.movieId);
    if (deletedMovie) {
      res.status(200).json({ message: "Movie deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete movie." });
  }
});

async function updateMovie(movieId, dataToUpdate) {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, {
      new: true,
    });
    return updatedMovie;
  } catch (error) {
    console.log("Error in updating Movie rating", error);
  }
}

app.post("/movies/:movieId", async (req, res) => {
  try {
    const updatedMovie = await updateMovie(req.params.movieId, req.body);
    if (updatedMovie) {
      res.status(200).json({
        message: "Movie updated successfully.",
        updatedMovie: updatedMovie,
      });
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to update movie." });
  }
});

module.exports = app;
