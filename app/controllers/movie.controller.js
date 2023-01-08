const db = require("../models");
const Movie = db.movies;

// Create and Save a new Movie
exports.create = (req, res) => {
   // Validate request
   if (!req.body.title) {
    res.status(400).send({ message: "title can not be empty!" });
    return;
  }

  // Create a Movie
  const movie = new Movie({
    title: req.body.title,
    year: req.body.year,
    rating: req.body.rating
  });

  // Save Movie in the database
  movie
    .save(movie)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Movie."
      });
    });
};

// Retrieve all Movie from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Movie.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving movies."
      });
    });
};


// Find a single Movie with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Movie.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Movie with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Movie with id=" + id });
    });
};
//put the list in order by title
exports.orderByTitle = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  
  Movie.find(condition)
    .then(movies => {
      // sort the movies by title
      const sortedMovies = movies.sort((a, b) => a.title.localeCompare(b.title));
      
      // send the sorted movies back to the client
      res.send(sortedMovies);
    })
    .catch(error => {
       res.send({message: 'error'});
    });
};

//put the list in order by date
exports.orderByDate = (req, res) => {
  const year = req.query.year;
  var condition = year ? { year: { $regex: new RegExp(year), $options: "i" } } : {};
  
  Movie.find(condition)
    .then(movies => {
      // sort the movies by title
      const sortedMovies = movies.sort((a, b) => a.year.localeCompare(b.year));
      
      // send the sorted movies back to the client
      res.send(sortedMovies);
    })
    .catch(error => {
       res.send({message: 'error'});
    });
};

//put the list in order by rating
exports.orderByRating = (req, res) => {
  const rating = req.query.rating;
  var condition = rating ? { rating: { $regex: new RegExp(rating), $options: "i" } } : {};
  
  Movie.find(condition)
    .then(movies => {
      // sort the movies by title
      const sortedMovies = movies.sort((a, b) => b.rating - a.rating);
      
      // send the sorted movies back to the client
      res.send(sortedMovies);
    })
    .catch(error => {
       res.send({message: 'error'});
    });
};

// Update a Movie by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Movie.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Movie with id=${id}. Maybe Movie was not found!`
        });
      } else res.send({ message: "Movie was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Movie with id=" + id
      });
    });
};

// Delete a Movie with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Movie.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Movie with id=${id}. Maybe Movie was not found!`
        });
      } else {
        res.send({
          message: "Movie was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Movie with id=" + id
      });
    });
};

